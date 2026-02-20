import Router from "express";
import { signUp,signIn, loginIn } from "./controllers/auth.controller.js";
const authRouter = Router();


authRouter.get("/sign-up",signUp);
authRouter.get("/sign-in",signIn);
authRouter.post("/sign-up",signUp);
authRouter.post("/sign-in",signIn);

export { authRouter };