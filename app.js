import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import { PORT, DB_HOST } from './config/env.js';
import { userRouter } from './routes/user.routes.js';
import { subRouter } from './routes/subscription.routes.js';
import { authRouter } from './routes/auth.routes.js';
import errorMiddleware from "./middlewares/error.middleware.js";
import { generalLimiter } from './middlewares/simplifiedRateLimit.middleware.js';
import { cloudflareBotsDetection } from './middlewares/botDetection.middleware.js';

const app = express();

// Database connection
mongoose.connect(DB_HOST || 'mongodb://localhost:27017/subscriptiontracker')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/',(req,res)=>{
    res.send("Welcome to the Subscription Tracker");
})

// Security middlewares (apply early)
app.use(cloudflareBotsDetection);
app.use(generalLimiter);

// Inbuild express Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies and allows us to access cookies via req.cookies
app.use(cookieParser());

// Middleware to parse URL-encoded bodies (from HTML forms)
app.use(express.urlencoded({extended:false})); 


// Routes
app.use('/users',userRouter);
app.use('/subscription', subRouter);
app.use('/auth', authRouter);

//Error handling middleware custom
app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`Server started on https://localhost:${PORT}`);
})

export default app;