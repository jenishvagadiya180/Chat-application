import express from "express";
const router = express.Router();
import { User } from "../controllers/index.js";
import { body } from "express-validator";
import { message } from "../helper/index.js";

router.post(
  "/addUser",
  [
    body("name")
      .exists()
      .isLength({ min: 2 })
      .withMessage(message.INVALID_NAME),
    body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
    body("password")
      .isLength({ min: 8 })
      .withMessage(message.PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS_LONG)
      .matches(/[a-z]/)
      .withMessage(message.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_LOWERCASE_LETTER)
      .matches(/[A-Z]/)
      .withMessage(message.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_UPPERCASE_LETTER)
      .matches(/[0-9]/)
      .withMessage(message.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_NUMBER)
      .matches(/[@$!%*?&#]/)
      .withMessage(
        message.PASSWORD_MUST_CONTAIN_AT_LEAST_ONE_SPECIAL_CHARACTER
      ),
  ],
  User.addUser
);

router.post(
  "/login",
  [
    body("email").exists().isEmail().withMessage(message.INVALID_EMAIL),
    body("password")
      .exists()
      .isLength({ min: 8 })
      .withMessage(message.INVALID_PASSWORD),
  ],
  User.userLogin
);

export default router;
