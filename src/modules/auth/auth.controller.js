import { ApiError } from "../../shared/utils/ApiError.js";
import { registerSchema } from "./auth.validator.js";
import { registerUser } from "./auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    const user = await registerUser({ username, email, password });

    res.status(201).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};