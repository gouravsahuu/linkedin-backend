const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {PostModel} = require("../Models/post.model");
const {auth} = require("../Middleware/auth.middleware");
const postRoute = express.Router();

postRoute.get("/",auth,async(req,res) => {
    const userID = req.body.userID;
    const device = req.query;
    try{
        let posts;
        if(device.device != undefined){
            posts = await PostModel.find({userID,device:device.device});
        }
        else{
            posts = await PostModel.find({userID});
        }
        if(posts.length == 0){
            res.send({"message":"You haven't created any posts yet"})
        }
        else if(posts.length > 0){
            res.send(posts);
        }
        else{
            res.send({"message":"Something Went Wrong"});
        }
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

postRoute.get("/top",auth,async(req,res) => {
    const userID = req.body.userID;
    try{
        const posts = await PostModel.find({userID}).sort({no_of_comments:-1});
        if(posts.length == 0){
            res.send({"message":"You haven't created any posts yet"})
        }
        else if(posts.length > 0){
            res.send(posts[0]);
        }
        else{
            res.send({"message":"Something Went Wrong"});
        }
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

postRoute.post("/create",auth,async(req,res) => {
    const postData = req.body;
    try{
        const post = new PostModel(postData);
        await post.save();
        res.send({"message":"Post Created Successfully"});
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

postRoute.patch("/update/:postid",auth,async (req,res) => {
    const postid = req.params.postid;
    const data = req.body;
    try{
        await PostModel.findByIdAndUpdate({_id:postid},data);
        res.send({"message":"Post Updated Successfully"});
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

postRoute.delete("/delete/:postid",auth,async (req,res) => {
    const postid = req.params.postid;
    try{
        await PostModel.findByIdAndDelete({_id:postid});
        res.send({"message":"Post Deleted Successfully"});
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

module.exports = {postRoute};