import User from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../shared/utils/ApiError.js";

const saltRound = 10;

export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const user = await User.findOne({ where: { email } });
  if (user) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(password, saltRound);
  const newUser = await User.create({
    username,
    email,
    passwordHash
  })

  const userJson = newUser.toJSON();
  delete userJson.passwordHash;

  return userJson;
};