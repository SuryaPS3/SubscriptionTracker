import Router from "express";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import { authorize } from "../middlewares/authorize.middleware.js";

const subRouter = Router();

subRouter.get("/",(req,res)=>{res.send({title: "Get all subscriptions"})});
subRouter.get("/:id",authorize, getUserSubscriptions);
subRouter.post("/",authorize, createSubscription);
subRouter.put("/:id",(req,res)=>{res.send(`Update Subscription with id: ${req.params.id}`)});
subRouter.delete("/:id",(req,res)=>{res.send(`Delete Subscription with id: ${req.params.id}`)});

export { subRouter };   