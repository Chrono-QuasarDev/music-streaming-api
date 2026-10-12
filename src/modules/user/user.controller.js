import { getProfile, getPublicProfile } from "./user.service.js";
import { updateUserProfile } from "./user.service.js";
import { updateProfileSchema } from "./user.validator.js";

export async function profile(req, res) {
  const { id } = req.user;
  const user = await getProfile(id);
  
  return res.status(200).json({
    success: true,
    message: 'User profile',
    data: user
  });
}

export async function publicProfile(req, res) {
  const { id } = req.params;
  const user = await getPublicProfile(id);

  return res.status(200).json({
    success: true,
    message: 'User profile',
    data: user
  });
}

export async function updateProfile(req, res) {
  const { id } = req.user;
  const userData = updateProfileSchema.parse(req.body);
  const updatedUser = await updateUserProfile(id, userData);

  return res.status(200).json({
    success: true,
    message: 'User profile updated',
    data: updatedUser
  });
}