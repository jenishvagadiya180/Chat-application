import { validationResult } from "express-validator";
import statusCode from "./httpStatusCode.js";
import jwt from "jsonwebtoken";

class services {
  static sendSuccess = async (res, message, payload) => {
    return services.setResponse(res, statusCode.SUCCESSFUL, message, payload);
  };
  static response = (code, message, data) => {
    if (data == null) {
      return {
        status: code,
        message: message,
      };
    } else {
      return {
        status: code,
        message: message,
        responseData: data,
      };
    }
  };

  static setResponse = async (res, statusCode, message, data) => {
    await res.send(this.response(statusCode, message, data));
  };

  static hasValidatorErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const msg = "Validation Failed";
      this.setResponse(res, statusCode.BAD_REQUEST, msg, errors.array());
      return true;
    } else {
      return false;
    }
  };

  static userTokenGenerate = async (payload, expireTime) => {
    const token = jwt.sign(payload, process.env.SECURITY_KEY, {
      expiresIn: expireTime,
    });
    return token;
  };

  static jwtVerify(token) {
    try {
      const verifyUser = jwt.verify(token, process.env.SECURITY_KEY);
      return verifyUser;
    } catch (error) {
      throw error;
    }
  }
}

export default services;
