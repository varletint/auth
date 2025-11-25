import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log('Redis: Max retries reached, giving up.');
                return new Error('Redis connection failed');
            }
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

let isConnected = false;

// Connect to Redis asynchronously
export const connectRedis = async () => {
    if (isConnected) return;

    try {
        await redisClient.connect();
        isConnected = true;
        console.log('✅ Redis connected successfully');
    } catch (err) {
        console.log('❌ Redis Connection Failed:', err);
        console.log('⚠️  Running without Redis caching.');
    }
};

// Helper to check if Redis is available
export const isRedisAvailable = () => isConnected && redisClient.isOpen;

export default redisClient;
