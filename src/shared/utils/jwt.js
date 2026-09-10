import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const EXPIRY = process.env.JWT_EXPIRES;

export function createToken(user) {
  return jwt.sign(
    { id: user.id,
      email: user.email,
      role: user.role
    },
    SECRET_KEY,
    { expiresIn: EXPIRY }
  )
}