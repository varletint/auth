import mongoose from "mongoose";
import dayjs from "dayjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    phone_no: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      // required: true,
    },
    business_name: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      unique: true,
      // required: true,
    },
    role: {
      type: String,
      default: ["admin, seller, buyer"],
    },
    post_count: {
      type: Number,
      default: 0,
    },
    postResetAt: {
      type: Date,
      default: () => dayjs().add(7, "days").startOf("day").toDate(),
    },
    resetOTP: {
      type: String,
      default: null,
    },
    resetOTPExpiry: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const U = mongoose.model("U", userSchema);

export default U;
