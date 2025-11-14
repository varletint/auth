import mongoose from "mongoose";

const testingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
    },
    product: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", testingSchema);

export default Product;
