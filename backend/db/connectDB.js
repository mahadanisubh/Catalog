import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        await mongoose.connect("mongodb+srv://mahadanisubh_db_user:mahadanisubh123@cluster0.4clzq1i.mongodb.net/catalog?appName=Cluster0")
        console.log("Connected to Mongodb")
    }
    catch(err){
        console.error(err)
    }
}

export default connectDB;
