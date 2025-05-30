import express from "express";
import {
  getAllUser,
  getUser,
  login,
  logout,
  register,
} from "../controller/userController.js";
import { verification } from "../middleware/registationTokenVerify.js";
import { validateUser, userSchema } from "../validators/userValidate.js";
import { hasToken } from "../middleware/hasToken.js";

const route = express.Router();

route.post("/register", validateUser(userSchema), register);
route.get("/verify", verification);
route.post("/login", login);
route.delete("/logout", hasToken, logout);
route.get("/getAll", hasToken, getAllUser);
route.get("/getUser", hasToken, getUser);

export default route;
