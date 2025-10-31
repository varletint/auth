export const testing = async (req, res, next) => {
  res.status(200).json({
    message: "working",
    success: true,
  });
};
