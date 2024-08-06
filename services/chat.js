import { sequelize, Sequelize } from "../config/connectDB.js";
import message from "../helper/message.js";
const models = sequelize.models;

class ChatServie {
  static getMessagesWithOtherPerson = async (userIdArray) => {
    return await models.Message.findAll({
      where: {
        sender: {
          [Sequelize.Op.in]: userIdArray,
        },
        receiver: {
          [Sequelize.Op.in]: userIdArray,
        },
        isDeleted: false,
      },
      include: [
        {
          model: models.User,
          as: "messageBelongsToSender",
          attributes: [],
        },
        {
          model: models.User,
          as: "messageBelongsToReceiver",
          attributes: [],
        },
      ],
      order: [["createdAt", "ASC"]],
      attributes: [
        "id",
        "message",
        "createdAt",
        [sequelize.col("messageBelongsToSender.name"), "sender"],
        [sequelize.col("messageBelongsToReceiver.name"), "receiver"],
      ],
    });
  };

  static updateMessages = async (messageArr) => {
    await models.Message.update(
      { isRead: true },
      {
        where: {
          id: messageArr.map((msg) => msg.id),
        },
      }
    );
  };
}

export default ChatServie;
