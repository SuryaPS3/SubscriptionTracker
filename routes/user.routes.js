import Router from "express";
import { getUsers, getUserById , updateUserProfile, deleteUser} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const userRouter = Router();

userRouter.get("/",getUsers);
userRouter.get("/:id",authorize, getUserById);
userRouter.post("/:id",(req,res)=>{res.send(`Create a new User with id : ${req.params.id}`)});
userRouter.put("/:id",authorize, updateUserProfile);
userRouter.delete("/:id",authorize,deleteUser);


export { userRouter };
