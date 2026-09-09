import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      success: false,
      error: error.message
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal Server Error"
  });
  console.error(error);
};

export { errorHandler };