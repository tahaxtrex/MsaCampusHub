import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/main.routes.js"
// import authRoutes from "./routes/auth.routes.js" // Auth moved to Supabase
// import {connectDB} from './lib/db.js' // Mongo removed
// import session from 'express-session' // Session removed
// import MongoStore from 'connect-mongo'; // MongoStore removed
import donationRoutes from "./routes/donation.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

// Session middleware removed as we use Supabase Auth on frontend

app.use(cors({
  origin: [
    "http://localhost:5173",              // local dev
    "http://localhost:5174",              // local dev (alternative port)
    "https://msacampushub.vercel.app"     // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// app.use('/api/auth', authRoutes); // Auth handled by Supabase
app.use("/api", donationRoutes);
app.use('/', mainRoutes);

try {
  // await connectDB(); // No DB connection needed for now
  app.listen(PORT, () => {
    console.log("server is running on : " + PORT);
  })

} catch (error) {
  console.log(error);
}