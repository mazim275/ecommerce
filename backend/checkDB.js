import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGOURL).then(async () => {
    console.log("Connected to DB:", process.env.MONGOURL);
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const products = await mongoose.connection.db.collection('products').find().toArray();
    console.log(`Found ${products.length} products in 'products' collection.`);
    if (products.length > 0) {
        console.log("First product name:", products[0].name);
    }

    mongoose.disconnect();
}).catch(err => console.error(err));
