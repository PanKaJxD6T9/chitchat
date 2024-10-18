import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoute.js'
import contactRoutes from './routes/contactRoute.js'
import setupSocket from './socket.js'
import messagesRoutes from './routes/messagesRoute.js'
import helmet from 'helmet'
import path from 'path';

dotenv.config();

const app = express()
const port = process.env.PORT || 8080;

const _dirname = path.resolve();

const databaseUrl = process.env.DATABASE_URL;

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Add security middleware
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "img-src 'self' data: https://cdn.jsdelivr.net https://images.unsplash.com;");
    next();
});

app.use(cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/contacts', contactRoutes)
app.use('/api/v1/messages', messagesRoutes)

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get('*', (_, res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

// Ensure environment variables are set
if (!process.env.DATABASE_URL || !process.env.ORIGIN) {
    console.error("Missing environment variables!");
    process.exit(1); // Exit if critical variables are missing
}

mongoose.connect(databaseUrl)
.then(()=>{
    console.log(`DB CONNECTION : ${mongoose.connection.host}`);
})
.catch((err)=>{
    console.log(err);
})

app.get("/", (req, res)=>{
    res.send("hello mf")
});

const server = app.listen(port, ()=>{
    console.log(`Server listening on Port: ${port}`)
});

setupSocket(server);
