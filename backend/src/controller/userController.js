import userSchema from "../models/userSchema.js";
import sessionSchema from "../models/sessionSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyMail } from "../emailVerify/verifyMail.js";
dotenv.config();

//user registration
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const existing = await userSchema.findOne({ email: email });
    if (existing) {
      return res.status(401).json({
        success: false,
        message: "User Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userSchema.create({
      userName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.secretKey, {
      expiresIn: "5m",
    });
    verifyMail(token, email);
    user.token = token;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      data: { userName: userName },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//user login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email: email });
    // console.log("user 1 ", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (!passwordCheck) {
        return res.status(402).json({
          success: false,
          message: "Incorrect password",
        });
      } else if (passwordCheck && user.verified === true) {
        const existing = await sessionSchema.findOneAndDelete({
          userId: user._id,
        });
        // console.log("my session", existing);

        await sessionSchema.create({ userId: user._id });

        const accessToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "10days",
          }
        );

        const refreshToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.secretKey,
          {
            expiresIn: "30days",
          }
        );

        user.isLoggedIn = true;
        await user.save();
        return res.status(200).json({
          success: true,
          message: "User Logged in Successfully",
          accessToken: accessToken,
          refreshToken: refreshToken,
          data: user,
        });
      } else {
        res.status(200).json({
          message: "Complete Email verification then Login..",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  const existing = await sessionSchema.findOne({ userId: req.userId });
  // console.log("existing ", existing);

  try {
    if (existing) {
      await sessionSchema.findOneAndDelete({ userId: req.userId });
      return res.status(200).json({
        success: true,
        message: "Session successfully ended",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User had no session",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all user
export const getAllUser = async (req, res) => {
  try {
    const users = await userSchema.find({ _id: { $ne: req.userId } });

    if (users) {
      res.status(200).json({
        success: true,
        message: "User fetched success",
        data: users,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User fetch fail",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get sinle user
export const getUser = async (req, res) => {
  try {
    const user = await userSchema.findById({ _id: req.userId });
    // console.log("my user", user);

    if (user) {
      res.status(200).json({
        success: true,
        message: "User fetched success",
        data: user,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User fetch fail",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
