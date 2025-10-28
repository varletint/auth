import Product from "../Models/product.model.js";
import U from "../Models/user.model.js";
import { errorHandler } from "../Utilis/errorHandler.js";
import dayjs from "dayjs";

export const createProduct = async (req, res, next) => {
  const dataFromWB = req.body;

  if (dataFromWB.event === "success") {
    const data = dataFromWB.data;
    const { phone_no, caption, image_url } = data;

    const existingUser = U.findOne({ phone_no });
    if (!existingUser) {
      return next(errorHandler(404, "Create an account to post your Product"));
    }

    if (existingUser.postCount > 7) {
      const now = dayjs;
      const resetDate = dayjs(existingUser.postResetAt);
      if (now.isAfter(resetDate)) {
        existingUser.postCount = 0;

        existingUser.postResetAt = now.add(7, "days").startOf("day");

        try {
          await existingUser.save();
        } catch (error) {
          console.error(error);
        }
      } else {
        return res.status(429).json({
          success: false,
          message:
            "You’ve reached your weekly post limit 7. Try again next week.",
        });
      }
    } else {
      try {
        await Product.create({
          phone_no,
          image_url,
          caption,
        });

        existingUser.postCount += 1;
        await existingUser.save();

        res.status(200).json({
          success: true,
          message: "Product created successfully",
          post,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
      }
    }
  }

  // if (dataFromWB.event === "success") {
  //   try {
  //     await Product.create({
  //       phone_no,
  //       image_url,
  //       caption,
  //     });

  //     existingUser.postCount += 1;
  //     await existingUser.save();

  //     res.status(200).json({
  //       success: true,
  //       message: "Product created successfully",
  //       post,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ error: "Server error" });
  //   }
  // }
};
