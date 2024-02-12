const apiError = require("./apiError");

const node_env=process.env.NODE_ENV || 'production';

const handleCustomError=(err)=>{
    const msg=`invalid mongoId ${err.value}`;
    return new apiError(msg,400);
};
const handleValidationError=(err)=>{
    const msg='invalid input data   '+
    Object.values(err.errors).map( ( { message } ) => message).join(' & ');
    return new apiError(msg,400);
};
const handleDuplicationError=(err)=>{
    const value=err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const msg='duplication value   '+value;
    return new apiError(msg,400);
};
const sendErrorProd=(err,res)=>{
    if( err.isOperational ){
        res.status(err.statusCode)
        .json({ mesage:err.message , status:err.status });
    } else {
        res.status(500)
        .json({ mesage:'something went wrong ', status:'failed' });
    };
};

const sendErrorDev=(err,res)=>{
    err.statusCode=err.statusCode || 500;
    err.status=err.status || 'error';
    res.status(err.statusCode)
        .json({ mesage:err.message , status:err.status });
};

const errorHandler=function(er,req,res,next){
    if( node_env === 'development' ){
        sendErrorDev(er,res);
    };
    if( node_env === 'production'  ){
        let objErr={ ... er };
        if ( objErr.name == 'CustomError'){
            objErr=handleCustomError(objErr);
        };
        if ( objErr.name == 'ValidationError' ){
            objErr=handleValidationError(objErr);
        };
        if ( objErr.code == 11000 ){
            objErr=handleDuplicationError(objErr);
        };
        sendErrorProd(objErr,res);
    };
};
module.exports=errorHandler;