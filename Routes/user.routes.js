const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {UserModel} = require("../Models/user.model");

const userRoute = express.Router();

userRoute.post("/register",async (req,res) => {
    const {name,email,gender,password,age,city} = req.body;
    try{
        const existingUser = await UserModel.find({email});
        if(existingUser.length == 0){
            bcrypt.hash(password, 5, async (err,hash) => {
                const user = new UserModel({name,email,gender,age,city,password:hash});
                await user.save();
                res.send({"message":"User registered Successfully"});
            })
        }
        else{
            res.send({"message":"User already exists"});
        }
    }
    catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
    }
})

userRoute.post("/login",async (req,res) => {
     const userDetail = req.body;
     try{
        const user = await UserModel.find({email:userDetail.email});
        if(user.length > 0){
            bcrypt.compare(userDetail.password, user[0].password, (err,result) => {
                if(result){
                    const token = jwt.sign({userID:user[0]._id},"somekey",{expiresIn: '1h'});
                    res.send({"message":"Log-In Success","token":token,"help":"You can use this token to access protected routes"});
                }
                else{
                    res.send({"message":"Login Failed, Invalid Credentials"});
                }
            })
        }
        else{
            res.send({"message":"Login Failed, Invalid Credentials"});
        }
     }
     catch(err){
        res.send({"message":"Something Went Wrong","error":err.message});
     }
})

module.exports = {userRoute};