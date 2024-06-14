const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Account = require("../models/Account");
const RefreshToken = require("../models/RefreshToken");
const BlackListToken = require("../models/BlackListToken");
const Conversation = require("../models/Conversation");

const multer = require("multer");
const { uploadAccountImage } = require("../config/uploads/multer");

const AccountController = {
  registerAccount: async (req, res) => {
    try {
      const { username, password, fullname } = req.body;
      console.log({ username, password, fullname });

      if (!username || username.length < 8 || username.length > 30) {
        return res.json({
          status: 400,
          message: "Username must be between 10 and 30 characters",
        });
      }

      const existingAccount = await Account.findOne({
        username: username,
      });

      if (existingAccount) {
        return res.json({ status: 409, message: "Username already exists" });
      }

      if (!fullname || fullname.length < 4 || fullname.length > 50) {
        return res.json({
          status: 400,
          message: "Full name must be between 10 and 50 characters",
        });
      }

      if (!password || password.length < 8 || password.length > 20) {
        return res.json({
          status: 400,
          message: "Password must be between 8 and 20 characters",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newAccount = new Account({
        username: username,
        password: hashed,
        fullname: fullname,
      });

      await newAccount.save();

      return res.json({ message: "Registration successful", status: 200 });
    } catch (error) {
      return res.json({ message: "Internal Server Error", status: 500 });
    }
  },

  generateAccessToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        admin: account.admin,
      },
      process.env.FURI_JWT_ACCESS_KEY,
      { expiresIn: "10s" }
    );
  },

  generateRefreshToken: (account) => {
    return jwt.sign(
      {
        id: account.id,
        admin: account.admin,
      },
      process.env.FURI_JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  loginAccount: async (req, res) => {
    const pathAccount = "accountImage/";

    try {
      const { username, password } = req.body;

      const account = await Account.findOne({
        username: username,
      }).select(
        "_id username fullname admin createAt updateAt __v avatar password"
      );

      if (!account) {
        return res.json({ status: 404, message: "Wrong username" });
      }

      const validPassword = await bcrypt.compare(password, account.password);

      if (!validPassword) {
        return res.json({ status: 404, message: "Wrong password" });
      }

      if (account && validPassword) {
        const accessToken = AccountController.generateAccessToken(account);
        const refreshToken = AccountController.generateRefreshToken(account);

        await RefreshToken.create({ token: refreshToken });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Deploy -> true
          path: "/",
          sameSite: "strict",
        });

        if (account && account.avatar) {
          account.avatar = pathAccount + account.avatar;
        }

        const { password, ...others } = account._doc;
        return res.json({
          status: 200,
          message: "Login successful",
          result: {
            ...others,
            accessToken,
          },
        });
      }
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error" });
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.json({ status: 401, message: "You're not authenticated" });
    }

    try {
      const tokenExists = await RefreshToken.exists({ token: refreshToken });

      if (!tokenExists) {
        return res.json({ status: 403, message: "Refresh token is not valid" });
      }

      jwt.verify(
        refreshToken,
        process.env.FURI_JWT_REFRESH_KEY,
        async (err, account) => {
          if (err) {
            return res.json({
              status: 403,
              message: "Refresh token is not valid",
            });
          }

          await RefreshToken.deleteOne({ token: refreshToken });

          const newAccessToken = AccountController.generateAccessToken(account);
          const newRefreshToken =
            AccountController.generateRefreshToken(account);

          await RefreshToken.create({ token: newRefreshToken });

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, // Deploy -> true
            path: "/",
            sameSite: "strict",
          });

          return res.json({ status: 200, accessToken: newAccessToken });
        }
      );
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error" });
    }
  },

  logoutAccount: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const accessToken = req.headers.token?.split(" ")[1];

      if (!refreshToken || !accessToken) {
        return res.json({ status: 401, message: "You're not authenticated" });
      }

      await RefreshToken.deleteOne({ token: refreshToken });

      const decoded = jwt.decode(accessToken);
      const expiresAt = new Date(decoded.exp * 1000);

      const blackListToken = new BlackListToken({
        token: accessToken,
        expiresAt: expiresAt,
      });

      await blackListToken.save();

      res.clearCookie("refreshToken");

      res.json({ status: 200, message: "Logged out successfully" });
    } catch (error) {
      res.json({ status: 500, message: "Internal Server Error" });
    }
  },

  uploadAvatar: async (req, res) => {
    uploadAccountImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      } else if (err) {
        return res.status(400).json({ message: err.message });
      }

      const accountID = req.account.id;
      const image = req.file;

      if (!image) {
        return res.status(400).json({ message: "No photo uploaded" });
      }

      const account = Account.findById(accountID).populate("avatar");

      const pathAccount = "accountImage/";

      if (account.avatar) {
        account.avatar = pathAccount + image.filename;
      }

      try {
        res.status(201).json({ message: "Success upload avatar", account });
      } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
      }
    });
  },

  sendFriendRequest: async (req, res, io) => {
    try {
      const senderId = req.account.id;
      const { receiverId } = req.body;

      const receiver = await Account.findById(receiverId);

      if (!receiver) {
        return res.status(404).json({ message: "Receiver does not exist" });
      }

      if (senderId === receiverId) {
        return res
          .status(400)
          .json({ message: "Can not send requests to yourself" });
      }

      const sender = await Account.findById(senderId);

      const isFriend = sender.friends.some((friend) =>
        friend.account._id.equals(receiverId)
      );
      if (isFriend) {
        return res.status(400).json({ message: "This person is your friend" });
      }

      if (sender.sentFriendRequests.includes(receiverId)) {
        return res.status(400).json({
          message: "You have sent a request to make friends with this person",
        });
      }

      sender.sentFriendRequests.push(receiverId);
      receiver.receivedFriendRequests.push(senderId);

      await sender.save();
      await receiver.save();

      io.to(receiverId).emit("sendFriendRequest", { senderId });

      return res.status(200).json({ message: "Send invitation successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  acceptFriendRequest: async (req, res, io) => {
    try {
      const receiverId = req.account.id;
      const { senderId } = req.body;

      const sender = await Account.findById(senderId);

      if (!sender) {
        return res.status(404).json({ message: "Sender does not exist" });
      }

      const receiver = await Account.findById(receiverId);

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        return res
          .status(400)
          .json({ message: "No friend request from this user" });
      }

      const newConversation = new Conversation({
        participants: [senderId, receiverId],
        messages: [],
      });
      await newConversation.save();

      receiver.friends.push({
        account: senderId,
        conversation: newConversation._id,
      });
      sender.friends.push({
        account: receiverId,
        conversation: newConversation._id,
      });

      receiver.receivedFriendRequests = receiver.receivedFriendRequests.filter(
        (id) => id.toString() !== senderId
      );
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (id) => id.toString() !== receiverId
      );

      await receiver.save();
      await sender.save();

      io.to(senderId).emit("acceptFriendRequest", { receiverId });

      return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  rejectFriendRequest: async (req, res, io) => {
    try {
      const receiverId = req.account.id;
      const { senderId } = req.body;

      const sender = await Account.findById(senderId);

      if (!sender) {
        return res.status(404).json({ message: "Sender does not exist" });
      }

      const receiver = await Account.findById(receiverId);

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        return res
          .status(400)
          .json({ message: "No friend request from this user" });
      }

      receiver.receivedFriendRequests = receiver.receivedFriendRequests.filter(
        (id) => id.toString() !== senderId
      );
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (id) => id.toString() !== receiverId
      );

      await receiver.save();
      await sender.save();

      return res.status(200).json({ message: "Friend request rejected" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getFriends: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const skip = parseInt(req.query._skip) || 0;

    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate({
        path: "friends.account",
        select: "username fullname avatar",
      });
      const friends = account.friends.slice(skip, skip + limit);

      if (friends.length > 0) {
        friends.forEach((friend) => {
          if (friend.account.avatar) {
            friend.account.avatar = pathAccount + friend.account.avatar;
          }
        });
      }

      return res.status(200).json({ friends });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },

  getNonFriends: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const skip = parseInt(req.query._skip) || 0;
    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate("friends");

      const friendsIds = account.friends.map((friend) => friend.account._id);

      friendsIds.push(accountId);

      const nonFriends = await Account.find(
        { _id: { $nin: friendsIds } },
        "username fullname avatar"
      )
        .skip(skip)
        .limit(limit);

      if (nonFriends.length > 0) {
        nonFriends.forEach((nonFriend) => {
          if (nonFriend.avatar) {
            nonFriend.avatar = pathAccount + nonFriend.avatar;
          }
        });
      }

      return res.status(200).json({ nonFriends });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};

module.exports = AccountController;
