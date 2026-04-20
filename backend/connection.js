import mongoose from "mongoose";
export default async function connection(){
console.log(process.env.MONGOURL);

    const db=await mongoose.connect(`${process.env.MONGOURL}`)
    console.log("mongodb connected");

    return db
    
    

}