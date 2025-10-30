import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    phone_no: {
      type: Number,
      required: true,
    },
    image_url: {
      required: true,
      type: String,
    },
    caption: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

export default Product;
