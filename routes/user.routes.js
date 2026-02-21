import Router from "express";
import { getUsers, getUserById } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const userRouter = Router();

userRouter.get("/",getUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/:id",(req,res)=>{res.send(`Create a new User with id : ${req.params.id}`)});
userRouter.put("/:id",(req,res)=>{res.send(`Update User with id: ${req.params.id}`)});
userRouter.delete("/:id",(req,res)=>{res.send(`Delete User with id: ${req.params.id}`)});


export { userRouter };
