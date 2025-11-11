import express from "express";

const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
app.get("/testing", (req, res) => {
  res.send("Testing endpoint is working!");
});

app.post("/webhook", (req, res) => {
  const { name } = req.body;
  console.log("Received name:", name);
  res.json({ message: "Webhook received", name });
});
