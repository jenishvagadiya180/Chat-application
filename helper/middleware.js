import { services, statusCode, message } from "../helper/index.js";
import { RequestError } from "../error/error.js";
import { sequelize } from "../config/connectDB.js";
const models = sequelize.models;

const auth = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization;

    if (!headerToken)
      throw new RequestError(statusCode.UNAUTHORIZED, message.UNAUTHORIZED);

    const [type, token] = headerToken.split(" ");
    if (type !== "Bearer" || !token)
      throw new RequestError(statusCode.UNAUTHORIZED, message.UNAUTHORIZED);

    const verify = services.jwtVerify(token);
    const userData = await models.User.findOne({ id: verify._id });
    req.user = userData;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
