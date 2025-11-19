import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  phone: String,
  userPhoneInput: String,
  planId: String,
  planTitle: String,
  network: String,
  amount: Number,
  currency: {
    type: String,
    default: "NGN",
  },
  paymentProvider: String,
  paymentReference: String,
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "cancelled"],
    default: "pending",
  },
  metadata: Object,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Purchase", purchaseSchema);
