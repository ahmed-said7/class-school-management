const mongoose= require('mongoose');
const classSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    students: [{type:mongoose.Types.ObjectId,ref:"User"}],
    school:  { type:mongoose.Types.ObjectId,ref:"User" },
    description:String
});

classSchema.index({name:'text'});
const classModel=mongoose.model('Class',classSchema);
module.exports=classModel;