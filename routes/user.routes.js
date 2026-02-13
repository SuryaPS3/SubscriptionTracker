import Router from "express";

const userRouter = Router();

userRouter.get("/",(req,res)=>{res.send("Get all users")});
userRouter.get("/:id",(req,res)=>{res.send(`User route with id: ${req.params.id}`)});
userRouter.post("/:id",(req,res)=>{res.send(`Create a new User with id : ${req.params.id}`)});
userRouter.put("/:id",(req,res)=>{res.send(`Update User with id: ${req.params.id}`)});
userRouter.delete("/:id",(req,res)=>{res.send(`Delete User with id: ${req.params.id}`)});


export { userRouter };
