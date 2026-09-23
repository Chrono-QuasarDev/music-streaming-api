import { getProfile, getPublicProfile } from "./user.service.js";

export async function profile(req, res, next) {
  try {
    const { id } = req.user;
    const user = await getProfile(id);
  
    return res.status(200).json({
      success: true,
      message: 'User profile',
      data: user
    });
  } catch (error) {
    next(error);
  }
}

export async function publicProfile(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getPublicProfile(id);

    return res.status(200).json({
      success: true,
      message: 'User profile',
      data: user
    });
  } catch (error) {
    next(error);
  }
}