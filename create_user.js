import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/user.js';
import argon2 from 'argon2';

dotenv.config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_KEYS);
        console.log("Connected to DB");

        const email = "asd4reps@gmail.com";
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("User already exists");
            return;
        }

        const hashedPassword = await argon2.hash("password123");

        const newUser = new User({
            username: "testuser",
            email: email,
            password: hashedPassword,
            phone_no: "1234567890",
            role: ["seller"],
            accountStatus: "active"
        });

        await newUser.save();
        console.log("User created successfully!");

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

createUser();
