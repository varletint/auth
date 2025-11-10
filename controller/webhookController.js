import Test from "../Models/testingModel.js";

export const testingWebhook = async (req, res, next) => {
  const name = `testin ${Math.floor(Math.random() * 100)}`;

  const newTest = new Test({ name });
  try {
    await newTest.save();

    res.status(200).json({ message: "Data created successfully", name });
  } catch (error) {
    console.log(error);
  }

  console.log(name);
};
