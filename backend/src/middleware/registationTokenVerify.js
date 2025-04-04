import dotenv from "dotenv";
dotenv.config();
import userSchema from "../models/userSchema.js";
import jwt from "jsonwebtoken";

//mail verification
export const verification = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing or Invalid",
      });
    } else {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.secretKey, async (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(400).json({
              success: false,
              message: "The registration Token is Expired",
            });
          }
          return res.status(400).json({
            success: false,
            message: "Token verification failed, possibly expired",
          });
        } else {
          const { id } = decoded;
          const user = await userSchema.findById(id);
          if (!user) {
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          } else {
            user.token = null;
            user.verified = true;
            await user.save();
            return res.status(200).json({
              success: true,
              message: "Email verified successfully",
            });
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not access",
    });
  }
};
