import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/user.js';

dotenv.config();

const addSellerRole = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_KEYS);
        console.log('✅ MongoDB Connected');

        // Prompt for username
        console.log('\n📝 Enter your username to add seller role:');
        const username = process.argv[2];

        if (!username) {
            console.log('❌ Please provide a username as argument');
            console.log('Usage: node addSellerRole.js <username>');
            process.exit(1);
        }

        // Find user and add seller role
        const user = await User.findOne({ username });

        if (!user) {
            console.log(`❌ User "${username}" not found`);
            process.exit(1);
        }

        // Check if user already has seller role
        if (user.role.includes('seller')) {
            console.log(`✅ User "${username}" already has seller role`);
        } else {
            // Add seller role
            user.role.push('seller');
            await user.save();
            console.log(`✅ Successfully added seller role to user "${username}"`);
        }

        console.log(`\nCurrent roles: ${user.role.join(', ')}`);

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

addSellerRole();
