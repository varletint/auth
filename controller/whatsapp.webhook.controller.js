// import Product from "../Models/product.model.js";
// import U from "../Models/user.model.js";
// import { errorHandler } from "../Utilis/errorHandler.js";
// import dayjs from "dayjs";
// import crypto from "crypto";
// import fs from "fs";
// import axios from "axios";
// // import AWS from "aws-sdk";
// // import express from "express";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const app = express();

// const {
//   APP_SECRET,
//   WHATSAPP_TOKEN,
//   S3_BUCKET_NAME,
//   AWS_REGION,
//   AWS_ACCESS_KEY_ID,
//   AWS_SECRET_ACCESS_KEY,
// } = process.env;

// // AWS.config.update({
// //   accessKeyId: AWS_ACCESS_KEY_ID,
// //   secretAccessKey: AWS_SECRET_ACCESS_KEY,
// //   region: AWS_REGION,
// // });
// const s3 = new S3Client({
//   region: AWS_REGION,
//   credentials: {
//     accessKeyId: AWS_ACCESS_KEY_ID,
//     secretAccessKey: AWS_SECRET_ACCESS_KEY,
//   },
// });

// // const s3 = new AWS.S3();
// // function verifySignature(rawBody, headerSignature) {
// //   if (!headerSignature) return false;
// //   const expected =
// //     "sha256=" +
// //     crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
// //   try {
// //     return crypto.timingSafeEqual(
// //       Buffer.from(expected),
// //       Buffer.from(headerSignature)
// //     );
// //   } catch {
// //     return false;
// //   }
// // }
// function verifySignature(rawBody, headerSignature) {
//   if (!headerSignature) return false;
//   const expected =
//     "sha256=" +
//     crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");

//   const sigBuf = Buffer.from(headerSignature);
//   const expBuf = Buffer.from(expected);
//   if (sigBuf.length !== expBuf.length) return false;

//   return crypto.timingSafeEqual(sigBuf, expBuf);
// }

// export const createProduct = async (req, res, next) => {
//   const signature = req.headers["x-hub-signature-256"];
//   const rawBody = req.rawBody;

//   if (!verifySignature(rawBody, signature))
//     return next(errorHandler(403, "invalid signature"));

//   res.sendStatus(200);

//   const data = req.body;
//   const entries = data.entry || [];

//   for (const entry of entries) {
//     const changes = entry.changes || [];
//     for (const change of changes) {
//       const value = change.value || {};
//       const messages = value.messages || [];

//       for (const msg of messages) {
//         const sender_phone_no = msg.from;
//         const type = msg.type;
//         const caption = msg.image?.caption || msg.text?.body || "";

//         //

//         const existingUser = await U.findOne({ phone_no: sender_phone_no });
//         if (!existingUser) {
//           // return next(
//           //   errorHandler(404, "Create an account to post your product")
//           // );
//           console.log(`User ${sender_phone_no} not found.`);
//           continue;
//         }
//         const now = dayjs();
//         const resetDate = dayjs(existingUser.postResetAt);

//         // if (!existingUser.postResetAt) {
//         //   existingUser.postResetAt = now.add(7, "days").startOf("day");
//         //   await existingUser.save();
//         //   resetDate = dayjs(existingUser.postResetAt);
//         // }
//         // if (now.isAfter(resetDate)) {
//         //   existingUser.post_count = 0;
//         //   existingUser.postResetAt = now.add(7, "days").startOf("day");
//         //   await existingUser.save();
//         // }
//         if (
//           !existingUser.postResetAt ||
//           now.isAfter(existingUser.postResetAt)
//         ) {
//           existingUser.post_count = 0;
//           existingUser.postResetAt = now.add(7, "days").startOf("day");
//           await existingUser.save();
//         }
//         if (existingUser.post_count >= 7) {
//           // return next(
//           //   errorHandler(
//           //     429,
//           //     "You've reached your weekly limit, suscribe to post more of your product or try again next week."
//           //   )
//           // );
//           console.log(`User ${sender_phone_no} exceeded post limit`);
//           continue;
//         }

//         if (type === "image" && msg.image?.id) {
//           const mediaId = msg.image.id;
//           let imageUrl = "";
//           try {
//             const localFile = await downloadMedia(mediaId);
//             imageUrl = await uploadToS3(localFile, `${mediaId}.jpg`);
//             // fs.unlinkSync(localFile);
//             try {
//               fs.unlinkSync(localFile);
//             } catch (err) {
//               console.warn("Failed to delete temp file:", err.message);
//             }
//           } catch (err) {
//             console.error("Media upload failed:", err);
//           }

//           //
//           const parts = caption.split(",").map((p) => p.trim());
//           const [category = "Uncategorized", name = "Unnamed", priceStr = "0"] =
//             parts;

//           const price = parseFloat(priceStr) || 0;

//           //
//           try {
//             await Product.create({
//               phone_no: sender_phone_no,
//               category: category || "Uncategorized",
//               name: name || "Unnamed",
//               price,
//               imageUrl,
//             });
//             existingUser.post_count += 1;
//             await existingUser.save();
//           } catch (error) {
//             next(error);
//           }
//         }
//         //
//       }
//     }
//   }

//   // if (rawBody.event !== "success") {
//   //   return next(errorHandler(400, " Invalid event type"));
//   // }
//   // const { phone_no, caption, image_url } = rawBody.data;
//   // try {
//   //   const existingUser = await U.findOne(phone_no);
//   //   if (!existingUser) {
//   //     return next(errorHandler(404, "Create an account to post your product"));
//   //   }
//   //   const now = dayjs();
//   //   const resetDate = dayjs(existingUser.postResetAt);

//   //   if (!existingUser.postResetAt) {
//   //     existingUser.postResetAt = now.add(7, "days").startOf("day");
//   //     await existingUser.save();
//   //     resetDate = dayjs(existingUser.postResetAt);
//   //   }
//   //   if (now.isAfter(resetDate)) {
//   //     existingUser.post_count = 0;
//   //     existingUser.postResetAt = now.add(7, "days").startOf("day");
//   //     await existingUser.save();
//   //   }
//   //   if (existingUser.post_count >= 7) {
//   //     return next(
//   //       errorHandler(429),
//   //       "You've reached your weekly limit, suscribe to post more of your product or try again next week."
//   //     );
//   //   }
//   //   const product = await Product.create({
//   //     ...dataFromWB.data,
//   //   });
//   //   existingUser.post_count += 1;
//   //   existingUser.save();
//   //   return res.status(200).json({
//   //     success: true,
//   //     message: " Product created",
//   //     post,
//   //   });
//   // } catch (error) {
//   //   return next(error);
//   // }
// };

// //

// async function downloadMedia(mediaId) {
//   const { data } = await axios.get(
//     `https://graph.facebook.com/v16.0/${mediaId}`,
//     {
//       params: { fields: "url", access_token: WHATSAPP_TOKEN },
//     }
//   );

//   const url = data.url;
//   const resp = await axios.get(url, {
//     responseType: "arraybuffer",
//     headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
//   });

//   const filePath = `./temp_${mediaId}.jpg`;
//   fs.writeFileSync(filePath, resp.data);
//   return filePath;
// }

// // async function uploadToS3(filePath, key) {
// //   const fileData = fs.readFileSync(filePath);
// //   const params = {
// //     Bucket: S3_BUCKET_NAME,
// //     Key: key,
// //     Body: fileData,
// //     ContentType: "image/jpeg",
// //     ACL: "public-read",
// //   };
// //   const result = await s3.upload(params).promise();
// //   return result.Location;
// // }

// async function uploadToS3(filePath, key) {
//   const fileData = fs.readFileSync(filePath);
//   const command = new PutObjectCommand({
//     Bucket: S3_BUCKET_NAME,
//     Key: key,
//     Body: fileData,
//     ContentType: "image/jpeg",
//     ACL: "public-read",
//   });
//   await s3.send(command);
//   return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
// }
