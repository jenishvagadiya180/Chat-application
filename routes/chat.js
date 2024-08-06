import express from "express";
const router = express.Router();
import { param } from "express-validator";
import { message, auth } from "../helper/index.js";
import { Chat } from "../controllers/index.js";

router.get(
  "/chatWithAnother/:secondUserId",
  auth,
  [param("secondUserId").isInt().withMessage(message.INVALID_SECOND_USERID)],
  Chat.getChatWithAnother
);

export default router;
