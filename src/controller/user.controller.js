const bcrypt  =  require('bcrypt');
const UserModel = require('../models/user.models');
const jwt = require('jsonwebtoken');

const UserInput  = async(req , res , next)=>{
    try {
    
    const {username , Email ,password} = req.body;

    if (!username || !Email || !password) {
         return res.status(400).json({ 
          success: false, 
        message: "Please provide all required fields." 
    });
    }

    const hashpassword = await bcrypt.hash(password,10);
    const newuser = await UserModel.create({
        username,
        password : hashpassword,
        Email,
    })

    const token =  jwt.sign({
        userId: newuser._id,
        email:newuser.email,
        username:newuser.username,
     },process.env.JWT_secret,)
     
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});



    next();

    }catch (err){
        return res.status(404).json({
            error : err.message
        })
    }
    
}

const UserLogin = async(req , res ,next)=>{

    try{
    const {username ,password} = req.body;
    const user = await UserModel.findOne({
        username
     })
     if(!user){
         return res.status(400).json({
            message : "Incorrect username or password "
        })
     }
     const isMatch = await bcrypt.compare(password,user.password);
     if(!isMatch){
         return res.status(400).json({ 
            message : "Incorrect username or password  "
        })
     }

     const token =  jwt.sign({
        userId: user._id,
        email:user.email,
        username:user.username,
     },process.env.JWT_secret,)
     
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

     next();
    }catch(err){
        return res.status(404).json({
            error : err.message
        })
     }
}





module.exports = {
    UserInput ,
    UserLogin
}
