import express from "express";
import { connectDB } from "./src/config/dbConnection.js";
import route from "./src/routes/userRoute.js";
import routeNote from "./src/routes/noteRoute.js";
import chatRoute from "./src/routes/chatRoute.js";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { saveChat } from "./src/controller/chatController.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT;
// app.listen(PORT, () => {
//   console.log(`Server Running at port ${PORT}`);
// });

connectDB();
app.use(cors());

app.use(express.json());
app.use("/user", route);
app.use("/note", routeNote);
app.use("/chat", chatRoute);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Notes app listening on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization"],
    credentials: true,
  },
});

io.use((socket, next) => {
  const accessToken = socket.handshake.headers.authorization.replace(
    "Bearer ",
    ""
  );
  // console.log(socket);
  // console.log(socket.senderId);
  jwt.verify(accessToken, process.env.secretKey, async (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.senderId = decoded.id;
    // console.log(socket.senderId);
    next();
  });
});

io.on("connection", (socket) => {
  // console.log("User connected", socket.senderId);
  socket.join(socket.senderId);

  socket.on("send_message", async (message) => {
    socket.to(message.receiverId).emit("message", message);
    await saveChat(socket.senderId, message.receiverId, message.message);
  });
});
