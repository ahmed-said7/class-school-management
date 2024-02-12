const multer=require('multer');
const apiError = require('./apiError');
const uuid=require('uuid');
const sharp=require('sharp');
const expressAsyncHandler = require('express-async-handler');

const uploadImage=()=>{
    const storage=multer.memoryStorage();
    const filter=function(req,file,cb){
        console.log(file);
        if(file.mimetype.startsWith('image')){
            return cb( null , true );
        }else{
            return cb( new apiError('Invalid file',400) , false );
        };
    };
    return multer({storage:storage,fileFilter:filter});
};

const resizeSingleFile=expressAsyncHandler(async (req,res,next)=>{
    if(req.file){
        let fileName=`uploads-${Date.now()}-${uuid.v4()}.jpeg`;
        req.body.image = fileName;
        await sharp(req.file.buffer).resize(500,500).toFormat('jpeg')
        .jpeg({quality:90}).toFile(`uploads/${fileName}`);
    };
    return next();
});
const uploadSingleImage=function(field){
    return uploadImage().single(field);
};

module.exports ={resizeSingleFile,uploadSingleImage};