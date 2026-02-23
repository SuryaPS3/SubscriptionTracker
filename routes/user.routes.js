import Router from "express";
import { getUsers, getUserById , updateUserProfile, deleteUser, changePassword} from "../controllers/user.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";
const userRouter = Router();

userRouter.get("/",getUsers);
userRouter.get("/:id",authorize, getUserById);
userRouter.put("/:id",authorize, updateUserProfile);
userRouter.patch("/:id/password",authorize, changePassword);
userRouter.delete("/:id",authorize,deleteUser);

export { userRouter };
