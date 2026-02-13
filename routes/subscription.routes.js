import Router from "express";

const subRouter = Router();

subRouter.get("/",(req,res)=>{res.send("Get all subscriptions")});
subRouter.get("/:id",(req,res)=>{res.send(`Subscription route with id: ${req.params.id}`)});
subRouter.post("/:id",(req,res)=>{res.send(`Create a new Subscription with id : ${req.params.id}`)});
subRouter.put("/:id",(req,res)=>{res.send(`Update Subscription with id: ${req.params.id}`)});
subRouter.delete("/:id",(req,res)=>{res.send(`Delete Subscription with id: ${req.params.id}`)});

export { subRouter };