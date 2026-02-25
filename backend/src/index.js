import 'dotenv/config'; // MUST be first — loads .env before any other module initializes
import express from "express";
import cors from "cors";
import mainRoutes from "./routes/main.routes.js";
import donationRoutes from "./routes/donation.routes.js";
import eventRoutes from "./routes/event.routes.js";
import msaiRoutes from "./routes/msai.routes.js";
import iftarTicketRoutes from "./routes/iftarTicket.routes.js";

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
app.use("/api/iftar-tickets", iftarTicketRoutes);
app.use('/', mainRoutes);

try {
  app.listen(PORT, () => {
    console.log("server is running on : " + PORT);
  })

} catch (error) {
  console.log(error);
}