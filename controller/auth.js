const userModel=require("../models/userModel");
const jwt=require('jsonwebtoken');
const expressHandler=require('express-async-handler');
const bcryptjs=require('bcryptjs');
const apiError = require("../utils/apiError");
const dotenv=require('dotenv');
dotenv.config();

//  @body   email name password 
//  @route  auth/login
const login=expressHandler(async (req, res, next) => {
    const user = await userModel.findOne({email:req.body.email});
    if(!user) {
        return next(new apiError('no user found',400))
    };
    const valid=await bcryptjs.compare(req.body.password,user.password);
    if(!valid){
        return next(new apiError('password mismatch or email error',400));
    };
    const token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"12d"});
    res.status(200).json({ token });
});

//  @body   email password 
//  @route  auth/signup
const signup = expressHandler( async (req,res,next) => {
    let user = await userModel.findOne({email:req.body.email});
    if(user) {
        return next(new apiError('email should be unique ',400));
    };
    user=await userModel.create(req.body);
    const token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"12d"});
    return res.status(200).json({ token });
} );

const protected=expressHandler(async ( req, res , next ) => {
    let token;
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token=req.headers.authorization.split(' ')[1];
    };
    if( !token ) return next(new apiError('no token found'));
    const decoded=jwt.verify(token,process.env.SECRET);
    if( !decoded) return next(new apiError('invalid token',400));
    const user=await userModel.findById(decoded.userId);
    if( !user) return next(new apiError('user not found',400));
    if( user.passwordChangedAt){
        const timestamps=Math.floor( user.passwordChangedAt / 1000 );
        if( decoded.iat < timestamps ) return next(new apiError('password changed at',400));
    };
    req.user = user;
    return next();
});

const allowedTo=(...roles)=> expressHandler(async(req,res,next)=>{
    if(!roles.includes(req.user.role)){ 
        return next(new apiError('you are not allowed to access role',400));
    };
    next();
});

//  @route  auth/get-me
const getLoggedUser=expressHandler(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({user});
});

const updateLoggedUser=expressHandler(async(req,res,next)=>{
    if(req.body.password){
        return next(new apiError('can not update password',400));
    };
    const user=await userModel.findByIdAndUpdate(req.user._id,req.body,{new:true});
    res.status(200).json({user});
});

const deleteLoggedUser=expressHandler(async(req,res,next)=>{
    const user=await userModel.findOneAndDelete({_id:req.user._id});
    res.status(200).json({status:"deleted"});
});


const updateLoggedUserPassword=expressHandler(async(req,res,next)=>{
    let user=req.user;
    user.password=req.body.password;
    user.passwordChangedAt=Date.now();
    await user.save();
    res.status(200).json({status:"updated"});
});
module.exports={
    login,signup,protected,allowedTo,
    getLoggedUser,updateLoggedUserPassword,deleteLoggedUser,
    updateLoggedUser
};