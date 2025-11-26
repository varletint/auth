import User from "../Models/user.js";
import argon2 from "argon2";
import { errorHandler } from "../Utilis/errorHandler.js";
import { validateSigninInput, validateSignupInput } from "../Utilis/validation.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password, phone_no } = req.body;

  const validationError = validateSignupInput(req.body);
  if (validationError) {
    return next(errorHandler(400, validationError));
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return next(errorHandler(400, "User with this email or username already exists"));
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone_no,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = newUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .status(201)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;


  if (req.body.email && typeof req.body.email === 'string') {
    req.body.email = req.body.email.trim();
  }


  const validationError = validateSigninInput(req.body);
  if (validationError) {
    return next(errorHandler(400, validationError));
  }

  try {

    const validUser = await User.findOne({ email }).lean();
    if (!validUser) return next(errorHandler(404, "User not found"));


    const validPassword = await argon2.verify(validUser.password, password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials"));


    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);


    const { password: pass, ...rest } = validUser;


    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
