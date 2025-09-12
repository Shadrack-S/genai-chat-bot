import'dotenv/config';
import express from "express";
import cors from "cors";
import connectDB from './config/dbConnection.js';



const app = express();

await connectDB()
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Routes
app.get("/",(req,res)=>{
    res.send("Server is Up!!!")
})

app.listen(port, () => {
    console.log(`Server is running on PORT:${port}`);
});
