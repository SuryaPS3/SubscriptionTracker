import Router from "express";

const authRouter = Router();

authRouter.get("/sign-up",(req,res)=>{res.send("Sign up route")});
authRouter.get("/sign-in",(req,res)=>{res.send("Sign in route")});
authRouter.post("/sign-up",(req,res)=>{res.send("Create a new user")});
authRouter.post("/sign-in",(req,res)=>{res.send("Authenticate user and return token")});

export { authRouter };