import User from "../Models/user.js";
import UserDetails from "../Models/userDetails.js";
import argon2 from "argon2";
import { errorHandler } from "../Utilis/errorHandler.js";
import { validateSigninInput, validateSignupInput } from "../Utilis/validation.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password, phone_no, appType } = req.body;

  const validationError = validateSignupInput(req.body);
  if (validationError) {
    return next(errorHandler(400, validationError));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { phone_no }] });
    if (existingUser) {
      return next(errorHandler(400, "User with this username or phone number already exists"));
    }

    const hashedPassword = await argon2.hash(password);

    // Set role based on appType: owner for business_management, buyer for marketplace
    const defaultRole = appType === "business_management" ? ["owner"] : ["buyer"];

    const newUser = new User({
      username,
      // email, // Optional field
      password: hashedPassword,
      phone_no,
      role: defaultRole,
      accountStatus: "active",
      appType: appType || "marketplace", // Default to marketplace if not provided
    });

    await newUser.save();
    await newUser.save();

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newUser._id, role: newUser.role, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true, // secure: true is required for sameSite: 'none' and works on localhost
        sameSite: 'none',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true, // secure: true is required for sameSite: 'none' and works on localhost
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days (1 month)
      })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { username, password } = req.body;


  if (req.body.username && typeof req.body.username === 'string') {
    req.body.username = req.body.username.trim();
  }


  const validationError = validateSigninInput(req.body);
  if (validationError) {
    return next(errorHandler(400, validationError));
  }

  try {
    // Find user and select password field explicitly
    const validUser = await User.findOne({ username }).select("+password");
    if (!validUser) return next(errorHandler(404, "User not found"));

    // Check if account is locked
    if (validUser.accountLockedUntil && validUser.accountLockedUntil > Date.now()) {
      return next(errorHandler(403, "Account is temporarily locked due to multiple failed login attempts. Please try again later."));
    }

    // Check account status
    if (validUser.accountStatus !== "active") {
      return next(errorHandler(403, `Account is ${validUser.accountStatus}. Please contact support.`));
    }

    const validPassword = await argon2.verify(validUser.password, password);
    if (!validPassword) {
      // Increment failed login attempts
      await validUser.incrementFailedLogins();
      return next(errorHandler(401, "Wrong credentials"));
    }

    // Reset failed login attempts on successful login
    await validUser.resetFailedLogins();
    validUser.lastLogin = Date.now();

    await validUser.save();

    const accessToken = jwt.sign(
      {
        id: validUser._id,
        role: validUser.role,
        username: validUser.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Convert to object and remove password
    const userObject = validUser.toObject();
    const { password: pass, ...rest } = userObject;

    // Fetch user details
    const userDetails = await UserDetails.findOne({ user_id: validUser._id });

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true, // secure: true is required for sameSite: 'none' and works on localhost
        sameSite: 'none',
        maxAge: 15 * 60 * 1000 // 15 minutes
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true, // secure: true is required for sameSite: 'none' and works on localhost
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days (1 month)
      })
      .status(200)
      .json({ ...rest, userDetails });
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  if (req.user.id !== req.params.id && req.params.id !== 'update') {
    // Allow if route is /update (handled by middleware/route) or if ID matches
    // But here we rely on req.user from verifyToken
  }

  try {
    const {
      username,
      email,
      phone,
      fullName,
      location,
      website,
      bio,
      businessName,
      businessEmail,
      businessPhone,
      businessAddress
    } = req.body;

    // 1. Update User Model (Basic Info)
    const userUpdates = {};
    if (username) userUpdates.username = username;
    if (email) userUpdates.email = email;
    if (phone) userUpdates.phone_no = phone;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userUpdates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"));
    }

    // 2. Update UserDetails Model (Extended Info)
    const userDetailsUpdates = {};

    if (fullName) userDetailsUpdates.fullName = fullName;
    if (bio) userDetailsUpdates.bio = bio;

    if (location) {
      // Simple parsing for "City, Country" format
      const parts = location.split(",").map(p => p.trim());
      userDetailsUpdates.location = {
        city: parts[0] || "",
        country: { name: parts[1] || "" },
        address: location // Store full string as address too
      };
    }

    if (website) {
      userDetailsUpdates.socialMedia = { website };
    }

    // Business Info
    if (businessName || businessEmail || businessPhone || businessAddress) {
      userDetailsUpdates.businessInfo = {
        businessName: businessName || undefined,
        businessEmail: businessEmail || undefined,
        businessPhone: businessPhone || undefined,
        businessAddress: businessAddress || undefined
      };
    }

    // Find or create UserDetails
    const updatedUserDetails = await UserDetails.findOneAndUpdate(
      { user_id: req.user.id },
      { $set: userDetailsUpdates },
      { new: true, upsert: true, runValidators: true }
    );

    // ==================== Auto-assign Seller Role ====================
    // Check if profile is complete: email, fullName, and businessName
    const hasEmail = updatedUser.email && updatedUser.email.trim() !== '';
    const hasFullName = updatedUserDetails?.fullName && updatedUserDetails.fullName.trim() !== '';
    const hasBusinessName = updatedUserDetails?.businessInfo?.businessName &&
      updatedUserDetails.businessInfo.businessName.trim() !== '';

    const profileComplete = hasEmail && hasFullName && hasBusinessName;
    const isAlreadySeller = updatedUser.role && updatedUser.role.includes('seller');

    if (profileComplete && !isAlreadySeller) {
      // Add 'seller' role to user
      await User.findByIdAndUpdate(
        req.user.id,
        { $addToSet: { role: 'seller' } },
        { new: true }
      );
      // Refresh user data for response
      updatedUser.role = [...(updatedUser.role || []), 'seller'];
    }

    // Track if seller upgrade happened
    const wasUpgradedToSeller = profileComplete && !isAlreadySeller;

    // 3. Combine and return response
    const responseData = {
      ...updatedUser._doc,
      userDetails: updatedUserDetails,
      ...(wasUpgradedToSeller && {
        message: "🎉 Congratulations! Your profile is complete. You are now a seller and can start posting products!",
        sellerUpgrade: true
      })
    };

    res.status(200).json(responseData);

  } catch (error) {
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldMap = {
        username: "Username",
        email: "Email address",
        phone_no: "Phone number"
      };
      const friendlyField = fieldMap[field] || field;
      return next(errorHandler(400, `${friendlyField} is already in use. Please choose a different one.`));
    }
    next(error);
  }
};
