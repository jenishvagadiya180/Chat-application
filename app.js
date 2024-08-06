import express from "express";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { connectDatabase, sequelize } from "./config/connectDB.js";
import { chat, user } from "./routes/index.js";
import { errorhandler } from "./error/index.js";
import { services, statusCode, message } from "./helper/index.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;
const models = sequelize.models;

connectDatabase();

app.use(express.json());
app.use("/user", user);
app.use("/chat", chat);
app.use(errorhandler);

const server = app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);

const wss = new WebSocketServer({
  server,
  verifyClient: (info, done) => {
    const token = info.req.headers["authorization"];
    if (!token || !token.startsWith("Bearer ")) {
      console.log("No token provided or invalid token format");
      return done(false, statusCode.UNAUTHORIZED, message.UNAUTHORIZED);
    }

    const bearerToken = token.split(" ")[1];
    const verifyUser = services.jwtVerify(bearerToken);
    info.req.user = verifyUser;
    done(true);
  },
});

const users = {};
wss.on("connection", (ws, request) => {
  const user = request.user;
  users[user._id] = ws;

  if (!user) {
    console.log(message.NO_USER_FOUND);
    ws.close();
    return;
  }
  console.log(`User connected: ${user.name}`);

  ws.on("message", async (data) => {
    console.log("Data from the client: %s", data);
    data = JSON.parse(data.toString("utf8"));
    try {
      await models.Message.create({
        sender: user._id,
        receiver: data.sendTo,
        message: data.message,
        isRead: false,
      });

      const recipientSocket = users[data.sendTo];

      if (recipientSocket && recipientSocket.readyState === ws.OPEN) {
        recipientSocket.send(
          JSON.stringify({
            type: "message",
            sender: user._id,
            message: data.message,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (error) {
      console.log("error.message :>> ", error.message);
    }
  });

  ws.on("close", () => {
    console.log("User disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error.message);
  });
});
