import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }

  if (error.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: "Song file not found"
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: "Token expired",
      message: "Please log in again"
    });
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
};

export { errorHandler };