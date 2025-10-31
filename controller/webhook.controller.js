export const testing = async (req, res, next) => {
  res.send(200).json({
    message: "working",
    success: true,
  });
};
