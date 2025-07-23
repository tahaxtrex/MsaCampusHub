import express from "express"
import { getPrayerTime } from "../controllers/main.controllers.js";


const router = express.Router();

router.get('/prayertime', getPrayerTime);


export default router