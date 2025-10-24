import mongoose from "mongoose";

const errSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const EL = mongoose.model("EL", errSchema);

export default EL;
