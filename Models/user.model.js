import mongoose from "mongoose";

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
    email: {
      type: String,
      unique: true,
      required: true,
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
      default: () => {
        const now = new Date();
        // const day = now.getDay();
        // const diff = 7 - day;
        const resetDate = new Date(now);
        resetDate.setDate(now.getDate() + 7);
        resetDate.setHours(0, 0, 0, 0);
        return resetDate;
      },
    },
  },
  { timestamps: true }
);

const U = mongoose.model("U", userSchema);

export default U;
