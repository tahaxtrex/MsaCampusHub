import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/main.routes.js"
import authRoutes from "./routes/auth.routes.js"

const app = express();
dotenv.config();
const PORT = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use(cors({
  origin: "http://localhost:5173", // frontend's real domain
  credentials: true
}));

app.use('/auth', authRoutes);
app.use('/', mainRoutes);



try {
    app.listen(PORT, ()=>{
    console.log("server is running on : " + PORT);
    })
    
} catch (error) {
    console.log(error);

}