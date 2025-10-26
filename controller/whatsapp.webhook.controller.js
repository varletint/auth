import Product from "../Models/product.model.js";
import U from "../Models/user.model.js";
import { errorHandler } from "../Utilis/errorHandler.js";

export const createProduct = async (req, res, next) => {
  const dataFromWB = req.body;
  const data = dataFromWB.data;
  const { phone_no, caption, image_url } = data;

  const existingUser = U.findOne({ phone_no });

  if (!existingUser) {
    return next(errorHandler(401, "Create account to post your Product"));
  }

  if (dataFromWB.event === "success") {
    try {
      await Product.create({
        phone_no,
        image_url,
        caption,
      });
    } catch (error) {
      console.log(error);
    }
  }
  res.sendStatus(200);
};
