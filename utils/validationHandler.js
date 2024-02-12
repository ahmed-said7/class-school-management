const { validationResult } =require('express-validator');

const validationHandler=function( req,res,next ){
    const errors=validationResult(req);
    if( !errors.isEmpty() ){
        const message=errors.array().map( error => error.msg ).join(' & ');
        return next( new apiError(message,400) );
    };
    return next();
};

module.exports=validationHandler;