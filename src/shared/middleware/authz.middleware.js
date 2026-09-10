import { ApiError } from "../utils/ApiError.js";

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!roles.includes(req.user.roles)) {
      throw new ApiError(403, 'Forbidden');
    }

    next();
  }
}