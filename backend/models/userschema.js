import mongoose from "mongoose";

const userschema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true}


});
export default mongoose.model.users || mongoose.model("users",userschema)