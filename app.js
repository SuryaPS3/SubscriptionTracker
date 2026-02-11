import express as 'express';

const app = express();

app.get('/',(req,res)=>{
    console.log("Welcome to the Subscription Tracker");
})

app.listen(3000,()=>{
    console.log("Server started on https://localhost:3000");
})