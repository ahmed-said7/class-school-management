const express=require('express');
const dotenv=require('dotenv');
const dbConnect=require('./config/db');
const errorHandler = require('./utils/errorHandler');
const apiError = require('./utils/apiError');
require('./config/cache');
const userRoutes=require('./routes/authRoutes');
const classRoutes=require('./routes/classRoutes')
dotenv.config();
const app=express();
dbConnect();
app.use(express.json());
app.use(express.static('uploads'))
app.use('/user',userRoutes);
app.use('/class',classRoutes);
app.all("*",(req,res,next)=>{
    return next(new apiError('Invalid route not found',400));
})
app.use(errorHandler);
const port= process.env.PORT || 9090;
const server=app.listen(port,()=>{
    console.log('server listening on port ')
});