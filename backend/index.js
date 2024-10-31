import express from 'express'
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express()

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

//user Routes
app.use("/api", userRoutes);