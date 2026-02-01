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
  origin: "http://localhost:5173",
  credentials: true
}))
app.use("/", router);
app.listen(port, () => {
  console.log("Connected to Server-Port 3000 ");
});

const startServer = () => {
  connectDB();
};
startServer();

