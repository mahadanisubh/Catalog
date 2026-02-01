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
app.listen(port, () => {
  console.log("Connected to Server-Port ",port);
});

const startServer = () => {
  connectDB();
};
startServer();

