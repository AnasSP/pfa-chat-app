import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/AuthRoute.js';
import contactsRoutes from './routes/ContactRoutes.js';
import setUpSocket from './socket.js';
import messagesRoutes from './routes/MessagesRoute.js';
import channelRoute from './routes/ChannelRoute.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5003;
const MONGO_URL = process.env.MONGO_URL


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"))


app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactsRoutes)

app.use("/api/messages", messagesRoutes)

app.use("/api/channel", channelRoute)

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

setUpSocket(server)

mongoose.connect(MONGO_URL)
    .then(() => {
            console.log('Connected to MongoDB successfully');
        })
    .catch((err) => {
            console.error('Error connecting to MongoDB:', err.message);
        });

