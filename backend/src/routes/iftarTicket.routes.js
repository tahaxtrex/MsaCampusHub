import express from "express";
import {
    registerTicket,
    getAllTickets,
    getCapacity,
    togglePaid,
} from "../controllers/iftarTicket.controller.js";

const router = express.Router();

// Public
router.get("/capacity", getCapacity);
router.post("/", registerTicket);

// Admin (no middleware guard since admin check is on frontend — same as rest of app)
router.get("/", getAllTickets);
router.patch("/:id/paid", togglePaid);

export default router;
