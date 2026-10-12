import { ApiError } from "../../shared/utils/ApiError.js";
import { registerSchema, loginSchema } from "./auth.validator.js";
import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  const { username, email, password } = registerSchema.parse(req.body);
  const user = await registerUser({ username, email, password });

  res.status(201).json({
    success: true,
    user
  });
};

export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { userJson, accessToken } = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: userJson,
      accessToken,
      expiresIn: process.env.JWT_EXPIRES
    }
  });
};