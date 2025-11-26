
import mongoose from 'mongoose';
import { signup } from './controller/authController.js';
import User from './Models/user.js';
import dotenv from 'dotenv';

dotenv.config();

// Mock Express req, res, next
const mockRequest = (body) => ({
    body,
});

const mockResponse = () => {
    const res = {};
    res.status = (code) => {
        console.log(`Response Status: ${code}`);
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        console.log('Response JSON:', data);
        res.jsonData = data;
        return res;
    };
    res.cookie = (name, val, options) => {
        console.log(`Cookie set: ${name}=${val ? val.substring(0, 10) + '...' : 'null'}`, options);
        res.cookieData = { name, val, options };
        return res;
    };
    return res;
};

const mockNext = (err) => {
    if (err) {
        console.error('Next called with error:', err);
    } else {
        console.log('Next called without error');
    }
};

// Standalone verification script
async function verifySignup() {
    console.log('Starting Signup Verification...');

    // Mock Mongoose if no DB connection
    const mockUserFindOne = async (query) => {
        console.log('Searching for user with:', query);
        if (query.$or && query.$or.some(q => q.email === 'existing@example.com')) {
            return { email: 'existing@example.com' };
        }
        return null;
    };

    const mockUserSave = async function () {
        console.log('Saving new user:', this);
        this._id = new mongoose.Types.ObjectId();
        this._doc = { ...this }; // Simulate _doc for the controller
        return this;
    };

    try {
        if (!process.env.MONGO_URI) {
            console.warn("No MONGO_URI found, skipping DB connection tests. Mocking instead.");
            User.findOne = mockUserFindOne;
            User.prototype.save = mockUserSave;
        } else {
            // Attempt connection but fallback to mock if it fails or if we prefer not to write to real DB
            // For safety in this environment, let's just MOCK it to be safe unless user explicitly wants DB test
            // But the user asked to "try again", implying they want it to work.
            // Let's try to connect.
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to DB");
        }
    } catch (err) {
        console.error("DB Connection failed:", err);
        User.findOne = mockUserFindOne;
        User.prototype.save = mockUserSave;
    }

    // 1. Valid Signup
    console.log('\n--- Testing Valid Signup ---');
    const validReq = mockRequest({
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        phone_no: 1234567890
    });
    const validRes = mockResponse();
    await signup(validReq, validRes, mockNext);

    // 2. Invalid Signup (Missing Email)
    console.log('\n--- Testing Invalid Signup (Missing Email) ---');
    const invalidReq = mockRequest({
        username: 'testuser',
        // email missing
        password: 'password123',
        phone_no: 1234567890
    });
    const invalidRes = mockResponse();
    await signup(invalidReq, invalidRes, mockNext);

    // 3. Existing User (Simulated)
    console.log('\n--- Testing Existing User ---');
    // We'll manually inject a check or just rely on the mock if we are mocking
    // If we are connected to DB, we just created a user, so let's try to create it AGAIN
    if (mongoose.connection.readyState === 1) {
        // Reuse the validReq body which was just used
        await signup(validReq, validRes, mockNext);
    } else {
        // If mocking, we need to simulate the "existing" check
        // The mockUserFindOne above handles 'existing@example.com'
        const existingReq = mockRequest({
            username: 'existinguser',
            email: 'existing@example.com',
            password: 'password123',
            phone_no: 1234567890
        });
        await signup(existingReq, validRes, mockNext);
    }

    // Cleanup
    if (mongoose.connection.readyState === 1) {
        if (validReq.body.email) {
            await User.deleteOne({ email: validReq.body.email });
            console.log('Cleaned up test user');
        }
        await mongoose.disconnect();
    }
}

verifySignup().catch(console.error);
