// clearDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function clearUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users from the database.`);
  } catch (error) {
    console.error("❌ Error clearing users collection:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

clearUsers();
