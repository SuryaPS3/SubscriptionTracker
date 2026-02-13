import express from 'express';
import { PORT } from './config/env.js';
import { userRouter } from './routes/user.routes.js';
const app = express();

app.get('/',(req,res)=>{
    res.send("Welcome to the Subscription Tracker");
})

app.use('/users',userRouter);
app.listen(PORT,()=>{
    console.log(`Server started on https://localhost:${PORT}`);
})

export default app;