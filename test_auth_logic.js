import { validateSigninInput } from './Utilis/validation.js';
import argon2 from 'argon2';

async function testValidation() {
    console.log("Testing Validation...");

    const validData = { email: "test@example.com", password: "password123" };
    const invalidEmail = { email: "invalid-email", password: "password123" };
    const missingPassword = { email: "test@example.com" };
    const injectionAttempt = { email: { $ne: null }, password: "password123" };

    console.assert(validateSigninInput(validData) === null, "Valid data should pass");
    console.assert(validateSigninInput(invalidEmail) === "Invalid email format", "Invalid email should fail");
    console.assert(validateSigninInput(missingPassword) === "Password is required and must be a string", "Missing password should fail");
    console.assert(validateSigninInput(injectionAttempt) === "Email is required and must be a string", "Injection attempt should fail");

    console.log("Validation tests passed!");
}

async function testArgon2() {
    console.log("Testing Argon2...");
    const password = "mysecretpassword";
    const hash = await argon2.hash(password);

    const valid = await argon2.verify(hash, password);
    const invalid = await argon2.verify(hash, "wrongpassword");

    console.assert(valid === true, "Argon2 should verify correct password");
    console.assert(invalid === false, "Argon2 should reject wrong password");

    console.log("Argon2 tests passed!");
}

async function runTests() {
    try {
        await testValidation();
        await testArgon2();
        console.log("All tests passed successfully!");
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
}

runTests();
