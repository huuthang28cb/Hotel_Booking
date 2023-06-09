import express from 'express';
import {Application, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';
import { errorHandler } from './middlewares/errorMiddleware';

// router imports
import userRoutes from './routes/userRoutes';
import roomRoutes from './routes/roomRoutes';
import uploadRoutes from './routes/uploadRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app: Application = express();

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

// Default 
app.get("/api", (req: Request, res: Response)  => {
    res.status(201).json({ message: "Welcome to Hotel Booking App" });
})
// User Route
app.use("/api/users", userRoutes);

// Room Route
app.use("/api/rooms", roomRoutes);

// Upload Route
app.use("/api/uploads", uploadRoutes);

// Booking Route
app.use("/api/bookings", bookingRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, (): void => console.log(`Server listening on PORT ${PORT}`));