import'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from './config/dbConnection.js';
import chatRouter from './routes/chatRoutes.js';



const app = express();

await connectDB()
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/",(req,res)=>{
    res.send("Server is Up!!!")
})

// Routes
app.use('/api/chat',chatRouter)

app.listen(port, () => {
    console.log(`Server is running on PORT:${port}`);
});
