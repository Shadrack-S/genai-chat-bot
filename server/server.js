import'dotenv/config';
import express from "express";
import cors from "cors";
import morgan from 'morgan';
import connectDB from './config/dbConnection.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';



const app = express();

await connectDB()
const port = process.env.PORT || 3000;
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health Check Route
app.get("/",(req,res)=>{
    res.send("Server is Up!!!")
})

// Routes
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/user',userRouter)

app.listen(port, () => {
    console.log(`Server is running on PORT:${port}`);
});
