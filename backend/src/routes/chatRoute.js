import express from "express";
import { getAllChat } from "../controller/chatController.js";

const chatRoute = express.Router();

chatRoute.post("/getChat", getAllChat);

export default chatRoute;
