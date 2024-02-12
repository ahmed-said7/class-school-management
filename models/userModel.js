const mongoose= require('mongoose');
const bcryptjs= require('bcryptjs');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:[6,'password min length is 6'],
    },
    role:{
        type:String
        ,enum:['student',"school"],
        default:'student'
    },
    school:{type:mongoose.Types.ObjectId,ref:"User"},
    passwordChangedAt:Date,
    image:String
});
userSchema.index({name:"text"});
userSchema.pre('save',async function(next){
    if( this.isModified('password') ){
        this.password=await bcryptjs.hash(this.password,10);
    };
    return next();
});
userSchema.post('init',function(doc){
    if(doc.image){
        doc.image=`${process.env.base_url}/${doc.image}`;
    };
})
const userModel=mongoose.model('User',userSchema);
module.exports=userModel;