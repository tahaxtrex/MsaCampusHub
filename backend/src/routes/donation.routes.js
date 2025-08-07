import express from "express";
import { createDonationIntent } from "../controllers/donation.controller.js"

const router = express.Router();
router.post("/donate_handle", createDonationIntent)

export default router