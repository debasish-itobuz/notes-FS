import chatSchema from "../models/chatSchema.js";

export const saveChat = async (sender, receiver, content) => {
  try {
    await chatSchema.create({
      sender,
      receiver,
      content,
      date: Date.now() + 330 * 60000,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllChat = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const allChat = await chatSchema.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    res.json({
      status: 200,
      data: allChat,
      message: `Successfully fetch all chat`,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: 500,
      message: err.message,
      success: false,
    });
  }
};
