const classModel = require('../models/classModel');
const userModel = require('../models/userModel');
const apiError = require('../utils/apiError');
const controller =require('../utils/apiFactory');
const asyncHandler=require('express-async-handler');
const apiFeatures = require('../utils/apiFeatures');

const addSchoolIdToBody=asyncHandler(async (req,res,next)=>{
    req.body.school=req.user._id;
    const numsOfStudents=req.body.students?.length;
    const users=await userModel.find({_id:{$in:req.body.students}});
    if(users.length !== numsOfStudents){
        return next(new apiError('Students ids not found',400))
    };
    return next();
});


const createClass=controller.createOne(classModel);
const accessClass=asyncHandler( async ( req,res,next )=>{
    const _id=req.params.id;
    const school=req.user._id;
    const allowed=await classModel.findOne({school,_id});
    if( ! allowed ){
        return next(new apiError('Could not find a class',400));
    };
    return next();
});
const deleteClass=controller.getOne(classModel);
const getClass=controller.getOne(classModel);
const updateClass=controller.updateOne(classModel);
const addStudentToClass=asyncHandler( async ( req,res,next )=>{
    const _id=req.params.id;
    const school=req.user._id;
    const student=req.body.student;
    const user=await userModel.findOne({_id:student,school});
    if(! user ){
        return next(new apiError('can not add student',400));
    };
    const clas=await classModel.findOneAndUpdate({school,_id},{$addToSet:{students:student}},{new:true});
    if( ! clas ){
        return next(new apiError('Could not find a class',400));
    };
    res.status(200).json({class:clas});
});
const removeStudentFromClass=asyncHandler( async ( req,res,next )=>{
    const _id=req.params.id;
    const school=req.user._id;
    const student=req.body.student;
    const user=await userModel.findOne({_id:student,school});
    if(! user ){
        return next(new apiError('can not add student',400));
    };
    const clas=await classModel.findOneAndUpdate({school,_id},{$pull:{students:student}},{new:true});
    if( ! clas ){
        return next(new apiError('Could not find a class',400));
    };
    res.status(200).json({class:clas});
});
const getAllClasses =asyncHandler( async ( req,res,next )=>{
    let query;
    if( req.user.role == "student" ){
        query=classModel.find({students: req.user._id});
    }else if( req.user.role == "school" ){
        query=classModel.find({school: req.user._id});
    };
    const queryObj=req.query;
    const features=
        new apiFeatures(query,queryObj).
        filter().search().sort()
        .select().pagination();
    const results=await features.query;
    const pagination=await features.pagination;
    res.status(200).json({results,pagination});
});
module.exports={
    addSchoolIdToBody,createClass,accessClass,deleteClass,getClass,
    updateClass,addStudentToClass,getAllClasses,removeStudentFromClass
};
