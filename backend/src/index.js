import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/main.routes.js"
import authRoutes from "./routes/auth.routes.js"
import {connectDB} from './lib/db.js'
import session from 'express-session'
import MongoStore from 'connect-mongo';
import donationRoutes from "./routes/donation.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT



app.use(express.json())
app.use(express.urlencoded({
    extended:true
}));

app.use(session({
  secret: process.env.SECRET_SESSION,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,      
    dbName: 'msa-session',
    collectionName: 'sessions',
    autoRemove: 'native',
  }),
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  }
}));


app.use(cors({
  origin: [
    "http://localhost:5173",              // local dev
    "https://msacampushub.vercel.app"     // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use("/api", donationRoutes); 
app.use('/', mainRoutes);



try {
    await connectDB();
    app.listen(PORT, ()=>{
    console.log("server is running on : " + PORT);
    })
    
} catch (error) {
    console.log(error);

}