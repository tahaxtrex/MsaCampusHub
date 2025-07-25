import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

export const connectDB = async ()=>{

    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log('connected to : ' + conn.connection.host)
    } catch (error) {
        console.log("connection error", error)
    }
}