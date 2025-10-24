import { errorHandler } from "../Utilis/errorHandler.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

import U from "../Models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!username?.trim() || !password?.trim())
    return next(errorHandler("401", "Space is empty"));

  try {
    const findExistingUser = U.findOne(email);
    if (findExistingUser)
      return next(
        errorHandler("401", "User with the following email already exit")
      );

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newU = new U({
      email,
      password: hashedPassword,
      role: "seller",
    });

    const savedU = await newU.save();

    const token = jsonwebtoken.sign(
      { id: savedU._id, role: savedU.role },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "1d",
      }
    );
    const { password: pass, ...rest } = savedU._doc;

    res
      .status(201)
      .cookie("acccess_token", token, {
        httpOnly: true,
      })
      .json({ ...rest, role: savedU.role });
  } catch (error) {
    next(error);
  }
};
