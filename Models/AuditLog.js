import mongoose from "mongoose";

const audit = new mongoose.Schema({
  phone: String,
  type: String,
  payload: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", audit);
