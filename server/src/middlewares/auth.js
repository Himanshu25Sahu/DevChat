import { User } from "../models/userModel.js";

import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    console.log("AUTH .JS ",token);

    if (!token) {
      return next(
        new ErrorHandler("You need to Login to Access this Resource", 401)
      );
    }
    const decodedData = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, error.statusCode));
  }
};
