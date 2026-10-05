import User from "../../database/models/user.model.js";
import Playlist from "../../database/models/playlist.model.js";
import { ApiError } from "../../shared/utils/ApiError.js";
import bcrypt from "bcrypt";

export async function getProfile(id) {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}

export async function getPublicProfile(id) {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username'],
    include: {
      model: Playlist,
      attributes: ['id', 'name']
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
}

export async function updateUserProfile(id, userData) {
  const user = await User.findByPk(id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  userData.passwordHash = await bcrypt.hash(userData.password, 10);

  await user.update(userData);
  user.passwordHash = undefined; // Remove passwordHash from the response
  return user;
}