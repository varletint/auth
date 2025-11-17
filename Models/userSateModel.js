import mongoose from "mongoose";

const userStateSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    state: {
      type: String,
    },
    selectedItem: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserState = mongoose.model("userState", userStateSchema);

export default UserState;
