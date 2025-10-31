import express from "express";
import crypto from "crypto";
import axios from "axios";
import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import Message from "../models/Message.js";
import Product from "../models/Product.js";

const router = express.Router();
router.use(express.raw({ type: "application/json" }));

const { VERIFY_TOKEN, APP_SECRET, WHATSAPP_TOKEN, S3_BUCKET_NAME } =
  process.env;

// --- AWS setup ---
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();

// --- Signature verification ---
function verifySignature(rawBody, headerSignature) {
  if (!headerSignature) return false;
  const expected =
    "sha256=" +
    crypto.createHmac("sha256", APP_SECRET).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(headerSignature)
    );
  } catch {
    return false;
  }
}

// --- GET webhook verification ---
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// --- POST webhook ---
router.post("/", async (req, res) => {
  const signature = req.headers["x-hub-signature-256"];
  const rawBody = req.body;

  if (!verifySignature(rawBody, signature)) {
    console.log("❌ Invalid signature");
    return res.sendStatus(403);
  }

  res.sendStatus(200);

  const data = JSON.parse(rawBody.toString());
  const entries = data.entry || [];

  for (const entry of entries) {
    const changes = entry.changes || [];
    for (const change of changes) {
      const value = change.value || {};
      const messages = value.messages || [];

      for (const msg of messages) {
        const from = msg.from; // sender phone number
        const type = msg.type;
        const caption = msg.image?.caption || msg.text?.body || "";

        if (type === "image" && msg.image?.id) {
          const mediaId = msg.image.id;
          let imageUrl = "";

          try {
            const localFile = await downloadMedia(mediaId);
            imageUrl = await uploadToS3(localFile, `${mediaId}.jpg`);
            fs.unlinkSync(localFile);
          } catch (err) {
            console.error("Media upload failed:", err);
          }

          // --- Parse caption ---
          const parts = caption.split(",").map((p) => p.trim());
          const [category, name, priceStr] = parts;
          const price = parseFloat(priceStr) || 0;

          // --- Save product ---
          await Product.create({
            sellerPhone: from,
            category: category || "Uncategorized",
            name: name || "Unnamed",
            price,
            imageUrl,
          });

          console.log(`🛒 Product created: ${name} (${category}) - ₦${price}`);
        } else if (type === "text") {
          await Message.create({ from, type, text: msg.text.body });
        }
      }
    }
  }
});

// --- Helpers ---
async function downloadMedia(mediaId) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v16.0/${mediaId}`,
    {
      params: { fields: "url", access_token: WHATSAPP_TOKEN },
    }
  );

  const url = data.url;
  const resp = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
  });

  const filePath = `./temp_${mediaId}.jpg`;
  fs.writeFileSync(filePath, resp.data);
  return filePath;
}

async function uploadToS3(filePath, key) {
  const fileData = fs.readFileSync(filePath);
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: key,
    Body: fileData,
    ContentType: "image/jpeg",
    ACL: "public-read",
  };
  const result = await s3.upload(params).promise();
  return result.Location;
}

export default router;
