import jwt from "jsonwebtoken";

const testJWT = async (req, res, next) => {
    const token = jwt.sign({ id: "123" }, 'ucantgetit');
    res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        })
        .status(201)
        .json(res);
};

// Mock objects for testing
const mockReq = {
    query: {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        phone_no: 1234567890
    }, // Mock req.query
    logout: () => { /* Mock logout function */ }
};

const mockNext = () => { };

const mockRes = () => {
    const res = {};
    res.statusCode = 200;
    res.data = null;
    res.cookies = {}; // To store cookies set by res.cookie

    res.status = function (code) {
        this.statusCode = code;
        return this; // Allows chaining like res.status(200).json(...)
    };

    res.json = function (data) {
        this.data = data;
        return this; // Allows chaining, though typically ends the response
    };

    res.cookie = function (name, value, options) {
        this.cookies[name] = { value, options };
        return this;
    };

    return res;
};

// Example usage with mocks
const res = mockRes();
testJWT(mockReq, res, mockNext);

// You can now inspect the state of the mock `res` object
// console.log("Mocked Response Status:", res.statusCode);
// console.log("Mocked Response Data:", res.data);
console.log("Mocked Response Cookies:", res.cookies);