import { services, message, statusCode } from "../helper/index.js";
import { sequelize, Sequelize } from "../config/connectDB.js";
import { RequestError } from "../error/index.js";
import { UserService, ChatService } from "../services/index.js";

const send = services.setResponse;

class Chat {
  static getChatWithAnother = async (req, res, next) => {
    try {
      const { secondUserId } = req.params;

      if (services.hasValidatorErrors(req, res)) {
        return;
      }
      const checkUser = await UserService.getUserByFindOne({
        id: secondUserId,
      });
      if (!checkUser) throw new RequestError(message.USER_NOT_FOUND);

      const messages = await ChatService.getMessagesWithOtherPerson([
        req.user.id,
        secondUserId,
      ]);
      if (messages) {
        await ChatService.updateMessages(messages);
      }

      return send(res, statusCode.SUCCESSFUL, message.SUCCESSFUL, messages);
    } catch (error) {
      console.log("error :>> ", error);
      next(error);
    }
  };
}

export default Chat;
