import mongoose from "mongoose";

const userStateSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    index: true,
  },
  state: {
    type: String,
    default: "START",
  },
  tempData: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

userStateSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.model("UserState", userStateSchema);
