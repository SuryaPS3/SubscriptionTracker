import { config } from 'dotenv';

config({path: `.env.${process.env.NODE_ENV || 'development'}.local`});

export const { 
    PORT, 
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    DB_HOST,
    REDIS_URL,
    QSTASH_URL,
    QSTASH_TOKEN,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY
} = process.env;