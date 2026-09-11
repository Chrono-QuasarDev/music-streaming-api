import User from "../../database/models/user.model.js";

export async function getProfile(id) {
  const user = User.findByPk(id, {
    attributes: { exclude: ['passwordHash'] } 
  });

  return user;
}