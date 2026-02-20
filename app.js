import express from 'express';
import { PORT } from './config/env.js';
import { userRouter } from './routes/user.routes.js';
import { subRouter } from './routes/subscription.routes.js';
import { authRouter } from './routes/auth.routes.js';
import errorMiddleware from "./middlewares/error.middleware.js";

const app = express();

app.get('/',(req,res)=>{
    res.send("Welcome to the Subscription Tracker");
})

// Inbuild express Middleware to parse JSON bodies
app.use(express.json());

app.use('/users',userRouter);
app.use('/subscription', subRouter);
app.use('/auth', authRouter);

//Error handling middleware custom
app.use(errorMiddleware);

app.listen(PORT,()=>{
    console.log(`Server started on https://localhost:${PORT}`);
})

export default app;