import e from "express";

const router = e.Router();

router.get("/test", (req, res) => {
  res.send("Hello from Vercel backend!");
});
router.get("/", (req, res) => {
  res.send("Hello from Vercel frontend");
});

export default router;
