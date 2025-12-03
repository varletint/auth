import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/user.js';

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_KEYS);
        console.log("Connected to DB");

        const email = "asd4reps@gmail.com";
        const user = await User.findOne({ email });

        if (user) {
            console.log("User found:", user.username);
        } else {
            console.log("User NOT found");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

checkUser();
