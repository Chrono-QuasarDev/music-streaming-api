import User from "../../database/models/user.model.js";
import bcrypt from "bcrypt";
import { ApiError } from "../../shared/utils/ApiError.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

const saltRound = 10;
const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRY = process.env.JWT_EXPIRES;

export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  const user = await User.findOne({
    where: {
      [Op.or]: [
        { email },
        { username }
      ]
    }
  });
  if (user) {
    throw new ApiError(409, "Email or username already registered");
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

export const loginUser = async (userData) => {
  const { email, password } = userData;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(404, 'Invalid credentials');
  }

  const isPassword = bcrypt.compare(password, user.passwordHash)
  if(!isPassword) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = createToken(user);

  const userJson = user.toJSON();
  delete userJson.passwordHash;
  
  return { userJson, accessToken };
}

function createToken(user) {
  return jwt.sign(
    { id: user.id,
      email: user.email,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: EXPIRY }
  )
}