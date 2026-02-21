import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import RedisStore from 'rate-limit-redis';
import { REDIS_URL } from '../config/env.js';

// Create Redis client
const redisClient = createClient({
    url: REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis with error handling
redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis for rate limiting');
});

// Connect to Redis
await redisClient.connect();

// General rate limiter - 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:general:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth rate limiter - stricter for login/signup - 5 requests per 15 minutes
export const authLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:auth:'
    }),
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Strict rate limiter for sensitive operations - 10 requests per hour
export const strictLimiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
        prefix: 'rl:strict:'
    }),
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: {
        error: 'Rate limit exceeded for sensitive operations, please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default redisClient;