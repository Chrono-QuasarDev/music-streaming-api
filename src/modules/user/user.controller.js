import { getProfile } from "./user.service.js";

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