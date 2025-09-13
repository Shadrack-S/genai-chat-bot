import { Schema, model } from "mongoose";

const chatSchema = new Schema({
  userName: { type: String, required: true },
  name: { type: String, required: true },
  message: [
    {
      isImage: { type: Boolean, required: true, default: false },
      isPublished: {type: Boolean, default: false },
      role:{type: String, required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }, 
    },
  ],
},{timestamps: true});

const ChatModel = model('Chat', chatSchema);
export default ChatModel;