import Router from "express";
import { createSubscription, getUserSubscriptions, updateSubscription, deleteSubscription } from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const subRouter = Router();

subRouter.get("/",(req,res)=>{res.send({title: "Get all subscriptions"})});
subRouter.get("/:id",authorize, getUserSubscriptions);
subRouter.post("/",authorize, createSubscription);
subRouter.put("/:id",authorize, updateSubscription);
subRouter.delete("/:id",authorize, deleteSubscription);

export { subRouter };   