import rateLimit from 'express-rate-limit';

// For now, use memory store (built-in) - we'll add Redis later
// Memory store is fine for development and small applications
// In production with multiple server instances, you'd want Redis

// General rate limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: 'draft-7', // Use draft-7 format for standard headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth rate limiter - stricter for login/signup - 5 requests per 15 minutes
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Strict rate limiter for sensitive operations - 10 requests per hour
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: {
        error: 'Rate limit exceeded for sensitive operations, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// TODO: Add Redis store in future for production scalability
// Example Redis implementation (commented for now):
/*
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

await redisClient.connect();

// Then add to rate limiter:
// store: new RedisStore({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//     prefix: 'rl:'
// }),
*/