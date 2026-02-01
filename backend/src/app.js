import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "../db/connectDB.js";
import router from "../routes/user.routes.js";
import cors from "cors"

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://catalog-2q8w.onrender.com",
  credentials: true
}))
app.use("/", router);
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
};
startServer();

