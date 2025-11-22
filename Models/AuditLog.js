import mongoose from "mongoose";

const audit = new mongoose.Schema({
  phone: String,
  type: String,
  payload: Object,
  createdAt: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", audit);
export default AuditLog;
