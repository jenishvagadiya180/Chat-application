import { sequelize } from "../config/connectDB.js";
const models = sequelize.models;

class UserService {
  static getUserByFindOne = async (filter) => {
    return await models.User.findOne({
      where: filter,
    });
  };

  static createUser = async (payload) => {
    const user = await models.User.create(payload);
    return await user.save();
  };
}

export default UserService;
