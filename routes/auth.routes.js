import Router from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/simplifiedRateLimit.middleware.js";
const authRouter = Router();

authRouter.post("/sign-up", authLimiter, signUp);
authRouter.post("/sign-in", authLimiter, signIn);
authRouter.post("/signOut", signOut);
export { authRouter };