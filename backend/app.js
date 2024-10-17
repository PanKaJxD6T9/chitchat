import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoute.js'
import contactRoutes from './routes/contactRoute.js'
import setupSocket from './socket.js'
import messagesRoutes from './routes/messagesRoute.js'

dotenv.config();

const app = express()
const port = process.env.PORT || 8080;

const databaseUrl = process.env.DATABASE_URL;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://vartalaap-hub.vercel.app"); // Update with your origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors({
    origin:[process.env.ORIGIN],
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
