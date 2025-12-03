import crypto from 'crypto';

// Generate a secure random JWT secret (64 bytes = 128 hex characters)
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('\n=================================');
console.log('Generated JWT_SECRET:');
console.log('=================================');
console.log(jwtSecret);
console.log('=================================');
console.log('\nAdd this to your .env file:');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('=================================\n');
