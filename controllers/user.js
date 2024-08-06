import { services, message, statusCode } from "../helper/index.js";
import bcrypt from "bcrypt";
import { RequestError, BadRequestError } from "../error/index.js";
import { UserService } from "../services/index.js";
const saltRounds = 10;

const send = services.setResponse;

class User {
  static addUser = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const matchEmail = await UserService.getUserByFindOne({
        email: req.body.email,
        isDeleted: false,
      });
      if (matchEmail) throw new RequestError(message.USER_ALREADY_EXISTS);

      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

      const userData = await UserService.createUser({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      return send(
        res,
        statusCode.SUCCESSFUL,
        message.USER_REGISTERED_SUCCESSFULLY,
        {
          _id: userData.id,
        }
      );
    } catch (error) {
      next(error);
    }
  };

  static userLogin = async (req, res, next) => {
    try {
      if (services.hasValidatorErrors(req, res)) {
        return;
      }

      const userData = await UserService.getUserByFindOne({
        email: req.body.email,
        isDeleted: false,
      });

      if (!userData) throw new BadRequestError(message.INVALID_EMAIL);

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (!isPasswordValid) throw new BadRequestError(message.INVALID_PASSWORD);

      const token = await services.userTokenGenerate(
        { email: req.body.email, name: userData.name, _id: userData.id },
        process.env.EXPIRE_TIME
      );

      const userObj = {
        userName: userData.userName,
        id: userData._id,
        token: token,
      };
      return send(
        res,
        statusCode.SUCCESSFUL,
        message.LOGIN_SUCCESSFUL,
        userObj
      );
    } catch (error) {
      next(error);
    }
  };
}

export default User;
