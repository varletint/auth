import test from "../Models/testingModel.js";

export const testingWebhook = async (req, res, next) => {
  const name = `testin ${Math.floor(Math.random() * 100)}`;

  try {
    await test.create({ name });

    res.status(200).json({ message: "Data created successfully", name });
  } catch (error) {
    console.log(error);
  }

  console.log(name);
};
