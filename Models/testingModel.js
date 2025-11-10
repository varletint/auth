import mongoose from "mongoose";

const testingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("test", testingSchema);

export default Test;
