import { Chat } from "../models/chatModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createChat =AsyncHandler(async (req, res) => {
  const { receiverId } = req.body;
  const userId = req.user.id;
    // Check if a chat already exists between the two users
    const existingChat = await Chat.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (existingChat) {
      // If a chat already exists, return it
      return res.status(200).json(existingChat);
    }

    // If no chat exists, create a new one
    const newChat = new Chat({
      members: [userId, receiverId],
    });

    const result = await newChat.save();
    return res.status(200).json(new ApiResponse(200,result,"chat created successfully"));
});

   
 // Get all chats where the user is a member
export const userChats =AsyncHandler( async (req, res) => {
  try {
    // Find chats where the current user (req.user.id) is a member
    const chats = await Chat.find({
      members: { $in: [req.user.id] },
    });

   
    
    // Respond with the list of chats
    res.status(200).json(chats);
  } catch (error) {
    // Send an error response if something goes wrong
    throw new ErrorHandler(500,'Server Error')
  }
}) ;

// Find a specific chat between two users
export const findChat =AsyncHandler( async (req, res) => {
  try {
    // Check if there is a chat with both the current user (req.user.id) and another user (from req.params.secondId)
    const chat = await Chat.findOne({
      members: { $all: [req.user.id, req.params.secondId] },
    });
    // If the chat is found, return it, otherwise return null (indicating no chat exists)
    res.status(200).json(chat || null);
    res.status(200).json(new ApiResponse(200,chat||null,"chat find"))
  } catch (error) {
    // Send an error response if something goes wrong
    throw new ErrorHandler(500,'Server Error')
  }
});