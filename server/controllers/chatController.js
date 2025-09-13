import ChatModel from "../models/chatModel.js";

// CREATE Chat

export const createChat = async (req, res) => {
  try {
    console.log(req.body);
    const chatData = {
      message: [],
      name: "New Chat",
      userName: req.body.userName, //for without authentication
    };
    const chat = await ChatModel.create(chatData);
    res.json({ success: true, message: "Chat created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GET ALL CHATS
export const getAllChats = async (req, res) => {
  try {
    const userName = req.query.userName; //for without authentication
    const chats = await ChatModel.find({ userName }).sort({ updatedAt: -1 });
    res.json({ success: true, chats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// // Delete Chat
// export const deleteChat = async (req, res)=>{
//     try{
//         const userId
//     }catch(error){
//         res.json({ success: false, message: error.message });
//     }
// }
