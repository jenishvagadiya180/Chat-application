import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import { userModel, messageModel } from "../models/index.js";
dotenv.config();

const database = process.env.DATABASE_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DIALECT;

const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

const user = userModel(sequelize, DataTypes);
const message = messageModel(sequelize, DataTypes);

message.belongsTo(user, {
  as: "messageBelongsToSender",
  targetKey: "id",
  foreignKey: "sender",
});

message.belongsTo(user, {
  as: "messageBelongsToReceiver",
  targetKey: "id",
  foreignKey: "receiver",
});

const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );

    //for Create Tables
    // await user.sync();
    // await message.sync();
    // console.log("tables created successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { connectDatabase, sequelize, Sequelize };
