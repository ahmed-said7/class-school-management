const userModel = require('../models/userModel');
const asyncHandler=require('express-async-handler');
const apiFeatures = require('../utils/apiFeatures');


const SchoolStudents=(req,res,next)=>{
    req.filterObj={};
    if(req.user.role == "school"){
        req.filterObj.school = req.user._id;
    };
    if(req.user.role == "student"){
        req.filterObj.school = req.user.school;
    };
    return next();
};

const getAllUsers=asyncHandler( async ( req,res,next )=>{
    let query=userModel.find();
    const filterObj=req.filterObj || {};
    const queryObj=req.query;
    const features=
        new apiFeatures(query,queryObj).
        filter(filterObj).search().sort()
        .select().pagination();
    const results=await features.query;
    const pagination=await features.pagination;
    res.status(200).json({results,pagination});
});
module.exports={getAllUsers,SchoolStudents};