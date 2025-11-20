import express from "express";
import { deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();

router.delete("/:id", deleteEvent);

export default router;
