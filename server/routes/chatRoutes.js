import express from 'express';
import { createChat, getAllChats } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.post('/create', createChat)
chatRouter.get('/get',getAllChats)

export default chatRouter;