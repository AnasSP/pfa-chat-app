import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const port = process.env.PORT || 5003;
const MONGO_URL = process.env.MONGO_URL

app.use(cors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST', 'PUT', 'PTACH', 'DELETE'],
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json());

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

mongoose.connect(MONGO_URL)
    .then(() => {
            console.log('Connected to MongoDB successfully');
        })
    .catch((err) => {
            console.error('Error connecting to MongoDB:', err.message);
        });