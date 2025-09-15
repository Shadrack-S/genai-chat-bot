import { text } from "express";
import gemiAI from "../config/geminiAI.js";
import ChatModel from "../models/chatModel.js";


export const textMessageController = async (req, res) => {
  try {
    const { chatId, prompt } = req.body;
    if (!chatId || !prompt) {
      return res.json({ success: false, message: "Invalid Data" });
    }
    // Load chat and history
    const chat = await ChatModel.findById(chatId);
    const history = chat.message.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts:[{text: msg.parts[0].text,}]
    }));
    if (!chat) {
      return res.json({ success: false, message: "Chat not found" });
    }
    chat.name = prompt
    chat.message.push({
      role: "user",
      parts: [{ text: prompt }],
      timestamp: Date.now(),
    });

    const aiChat = gemiAI.chats.create({
      model: "gemini-2.0-flash",
      history: history,
    });
    const reponseAi = await aiChat.sendMessage({ message: prompt });
    res.json({
      success: true,
      message: "Message added",
      reply: reponseAi.text,
    });
    chat.message.push({
      role: "model",
      parts: [{ text: reponseAi.text }],
      timestamp: Date.now(),
    });
    chat.save();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
