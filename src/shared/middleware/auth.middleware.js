import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export async function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(401, 'Access denied! Please provide token');
    }
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new ApiError(401, 'Access denied! Please provide a valid token');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}