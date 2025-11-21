import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/main.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import eventRoutes from "./routes/event.routes.js";
import msaiRoutes from "./routes/msai.routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(cors({
  origin: [
    "http://localhost:5173",              // local dev
    "http://localhost:5174",              // local dev (alternative port)
    "https://msacampushub.vercel.app"     // deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api", donationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/msai", msaiRoutes);
app.use('/', mainRoutes);

try {
  app.listen(PORT, () => {
    console.log("server is running on : " + PORT);
  })

} catch (error) {
  console.log(error);
}