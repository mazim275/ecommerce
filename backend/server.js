import express from "express"
import cors from "cors"
import connection from "./connection.js"
import router from "./router.js"


const PORT=3000
const app=express()
app.use(express.json({limit:"50mb"}))
app.use(cors())
app.use("/api",router)



connection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`server created at localhost://${PORT}`);
        
    })
}).catch((error)=>{
    console.log("error while creating the server"+error);
    
})