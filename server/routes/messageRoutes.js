import express from "express";
import { textMessageController } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/text", textMessageController);

export default messageRouter;