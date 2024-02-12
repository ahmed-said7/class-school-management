const asyncHandler=require('express-async-handler');
const apiError = require('./apiError');
const getOne=(model,population="")=> asyncHandler ( async(req,res,next)=>{
    const id=req.params.id;
    const query=model.findById(id);
    if(population){
        query=query.populate(population);
    };
    const document=await query;
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${id}`,400));
    };
    return res.status(200).json({status:"success",result:document});
});

const createOne=(model)=> asyncHandler(async(req,res,next)=>{
    let document=await model.create(req.body);
    if(!document){
        return next(new apiError(`Couldn't create ${model} `,400));
    };
    // await document.save();
    res.status(200).json({status:"success",result:document}); 
})

const updateOne=(model)=> asyncHandler(async(req,res,next)=>{
    const document=await model.findOneAndUpdate({_id:req.params.id},req.body,{new:true});
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${req.params.id}`,400));
    };
    await document.save();
    res.status(200).json({status:"success",result:document});
});

const deleteOne=(model)=> asyncHandler(async(req,res,next)=>{
        let document=await model.findOneAndDelete({_id:req.params.id});
        if(!document){
            return next(new apiError(`Couldn't find ${model} for ${id}`,400));
        };
        res.status(200).json({status:"success",result:`document deleted`});
});


module.exports={getOne,createOne,updateOne,deleteOne};