const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Account = require("../models/Account");
const Message = require("../models/Message");
const RefreshToken = require("../models/RefreshToken");
const BlackListToken = require("../models/BlackListToken");
const Conversation = require("../models/Conversation");

const multer = require("multer");
const { uploadAccountImage, deleteFile } = require("../config/uploads/multer");

const AccountController = {
  registerAccount: async (req, res) => {
    try {
      const { username, password, fullname } = req.body;

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
      console.log({ error });
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
      { expiresIn: "7d" }
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
          account: {
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

          return res.json({
            status: 200,
            message: "Refresh token successful",
            accessToken: newAccessToken,
          });
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

  uploadBackground: async (req, res) => {
    uploadAccountImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.json({ status: 400, message: err.message });
      } else if (err) {
        return res.json({ status: 400, message: err.message });
      }

      const accountID = req.account.id;
      const image = req.file;

      if (!image) {
        return res.json({ status: 400, message: "No photo uploaded" });
      }

      try {
        const account = await Account.findById(accountID).select("background");

        const pathAccount = "accountImage/";
        const oldBackground = pathAccount + account.background;

        if (oldBackground) {
          deleteFile(oldBackground);
        }

        account.background = image.filename;
        await account.save();

        res.json({
          status: 201,
          message: "Success upload background",
          background: pathAccount + account.background,
        });
      } catch (error) {
        return res.json({
          status: 500,
          message: "Internal Server Error",
          error,
        });
      }
    });
  },

  uploadAvatar: async (req, res) => {
    uploadAccountImage(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.json({ status: 400, message: err.message });
      } else if (err) {
        return res.json({ status: 400, message: err.message });
      }

      const accountID = req.account.id;
      const image = req.file;

      if (!image) {
        return res.json({ status: 400, message: "No photo uploaded" });
      }

      try {
        const account = await Account.findById(accountID).select("avatar");

        const pathAccount = "accountImage/";
        const oldAvatar = pathAccount + account.avatar;

        if (oldAvatar) {
          deleteFile(oldAvatar);
        }

        account.avatar = image.filename;
        await account.save();

        res.json({
          status: 201,
          message: "Success upload avatar",
          avatar: pathAccount + account.avatar,
        });
      } catch (error) {
        return res.json({
          status: 500,
          message: "Internal Server Error",
        });
      }
    });
  },

  getInfo: async (req, res) => {
    const pathAccount = "accountImage/";

    try {
      const { accountId } = req.params;
      const currentUserId = req.account.id;

      const account = await Account.findById(accountId)
        .select(
          "username fullname avatar background friends sentFriendRequests receivedFriendRequests"
        )
        .populate("friends.account", "fullname avatar _id");

      if (!account) {
        return res.json({ status: 404, message: "Account not found" });
      }

      if (account.avatar) {
        account.avatar = pathAccount + account.avatar;
      }
      if (account.background) {
        account.background = pathAccount + account.background;
      }

      const friendCount = account.friends.length;

      const isFriend = account.friends.some((friend) =>
        friend.account.equals(currentUserId)
      );
      const hasSentFriendRequest =
        account.receivedFriendRequests.includes(currentUserId);
      const hasReceivedFriendRequest =
        account.sentFriendRequests.includes(currentUserId);
      const isCurrentUser = accountId === currentUserId;

      const friendsList = account.friends
        .map((friend) => ({
          fullname: friend.account.fullname,
          avatar: friend.account.avatar
            ? pathAccount + friend.account.avatar
            : null,
          _id: friend.account._id,
        }))
        .slice(0, 9);

      let conversationId = null;
      if (!isCurrentUser && isFriend) {
        const conversation = await Conversation.findOne({
          participants: { $all: [accountId, currentUserId] },
        }).select("_id");

        if (conversation) {
          conversationId = conversation._id;
        }
      }

      const newAccount = {
        username: account.username,
        fullname: account.fullname,
        avatar: account.avatar,
        background: account.background,
        friendCount: friendCount,
        isFriend: isFriend,
        hasSentFriendRequest: hasSentFriendRequest,
        hasReceivedFriendRequest: hasReceivedFriendRequest,
        isCurrentUser: isCurrentUser,
        friends: friendsList,
        conversationId: conversationId,
      };

      return res.json({
        status: 200,
        message: "Get account info successfully",
        account: newAccount,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  sendFriendRequest: async (req, res, io) => {
    const pathAccount = "accountImage/";

    try {
      const senderId = req.account.id;
      const { receiverId } = req.body;

      const receiver = await Account.findById(receiverId);

      if (!receiver) {
        return res.json({ status: 404, message: "Receiver does not exist" });
      }

      if (senderId === receiverId) {
        return res.json({
          status: 400,
          message: "Can not send requests to yourself",
        });
      }

      const sender = await Account.findById(senderId);

      const isFriend = sender.friends.some((friend) =>
        friend.account._id.equals(receiverId)
      );
      if (isFriend) {
        return res.json({ status: 400, message: "This person is your friend" });
      }

      if (sender.sentFriendRequests.includes(receiverId)) {
        return res.json({
          status: 400,
          message: "You have sent a request to make friends with this person",
        });
      }

      if (receiver.sentFriendRequests.includes(senderId)) {
        return res.json({
          status: 400,
          message: "This person has already sent a friend request to you",
        });
      }

      sender.sentFriendRequests.push(receiverId);
      receiver.receivedFriendRequests.push(senderId);

      await sender.save();
      await receiver.save();

      const receiverInfo = {
        _id: receiverId,
        fullname: receiver?.fullname,
        avatar: receiver?.avatar ? pathAccount + receiver.avatar : null,
        username: receiver?.username,
      };

      io.emit(`emitEveryoneRequest${senderId}${receiverId}`, {
        type: "sent",
        receiver: receiverInfo,
      });

      return res.json({ status: 200, message: "Send invitation successfully" });
    } catch (error) {
      console.log({ error });
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  acceptFriendRequest: async (req, res, io) => {
    try {
      const receiverId = req.account.id;
      const { senderId } = req.body;

      const sender = await Account.findById(senderId);

      if (!sender) {
        return res.json({ status: 404, message: "Sender does not exist" });
      }

      const receiver = await Account.findById(receiverId);

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        return res.json({
          status: 400,
          message: "No friend request from this user",
        });
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

      io.emit(`emitEveryoneRequest${receiverId}${senderId}`, {
        type: "accept",
        conversationId: newConversation._id,
      });

      io.emit("newFriend" + senderId);
      io.emit("newFriend" + receiverId);

      return res.json({ status: 200, message: "Friend request accepted" });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  rejectFriendRequest: async (req, res, io) => {
    try {
      const receiverId = req.account.id;
      const { senderId } = req.body;

      const sender = await Account.findById(senderId);

      if (!sender) {
        return res.json({ status: 404, message: "Sender does not exist" });
      }

      const receiver = await Account.findById(receiverId);

      if (!receiver.receivedFriendRequests.includes(senderId)) {
        return res.json({
          status: 400,
          message: "No friend request from this user",
        });
      }

      receiver.receivedFriendRequests = receiver.receivedFriendRequests.filter(
        (id) => id.toString() !== senderId
      );
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (id) => id.toString() !== receiverId
      );

      await receiver.save();
      await sender.save();

      io.emit(`emitEveryoneRequest${receiverId}${senderId}`, {
        type: "reject",
      });

      return res.json({ status: 200, message: "Friend request rejected" });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getFriends: async (req, res) => {
    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate({
        path: "friends.account",
        select: "fullname avatar username",
      });

      let friends = account.friends;

      const friendsWithDetails = await Promise.all(
        friends.map(async (friend) => {
          const conversation = await Conversation.findById(
            friend.conversation
          ).populate({
            path: "messages",
            populate: {
              path: "sender",
              select: "fullname",
            },
            options: { sort: { createdAt: -1 }, limit: 1 },
          });

          const lastMessage = conversation.messages[0];

          let hasRead;

          if (conversation.read.length > 0) {
            hasRead = conversation.read.includes(accountId);
          } else {
            hasRead = true;
          }

          return {
            ...friend.toObject(),
            lastMessage: lastMessage
              ? {
                  content: lastMessage.content,
                  senderName: lastMessage.sender.fullname,
                  createdAt: lastMessage.createdAt,
                }
              : null,
            conversationCreatedAt: conversation.createdAt,
            hasRead,
          };
        })
      );

      friendsWithDetails.sort((a, b) => {
        const dateA = a.lastMessage
          ? new Date(a.lastMessage.createdAt)
          : new Date(a.conversationCreatedAt);
        const dateB = b.lastMessage
          ? new Date(b.lastMessage.createdAt)
          : new Date(b.conversationCreatedAt);
        return dateB - dateA;
      });

      const paginatedFriends = friendsWithDetails;

      paginatedFriends.forEach((friend) => {
        if (friend.account.avatar) {
          friend.account.avatar = pathAccount + friend.account.avatar;
        }
      });

      return res.json({
        status: 200,
        message: "Get friends successful",
        friends: paginatedFriends,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getNonFriends: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId)
        .populate("friends.account")
        .populate("sentFriendRequests")
        .populate("receivedFriendRequests");

      const friendsIds = account.friends.map((friend) => friend.account._id);
      const sentFriendRequestsIds = account.sentFriendRequests.map(
        (request) => request._id
      );
      const receivedFriendRequestsIds = account.receivedFriendRequests.map(
        (request) => request._id
      );

      const excludedIds = friendsIds.concat(
        sentFriendRequestsIds,
        receivedFriendRequestsIds,
        account._id
      );

      const nonFriends = await Account.aggregate([
        { $match: { _id: { $nin: excludedIds } } },
        { $sample: { size: limit } },
        { $project: { fullname: 1, avatar: 1, username: 1, background: 1 } },
      ]);

      if (nonFriends.length > 0) {
        nonFriends.forEach((nonFriend) => {
          if (nonFriend.avatar) {
            nonFriend.avatar = pathAccount + nonFriend.avatar;
          }
        });
      }

      return res.json({
        status: 200,
        message: "Get non friends successful",
        nonFriends,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getSentFriendRequests: async (req, res) => {
    const limit = parseInt(req.query._limit) || 10;
    const skip = parseInt(req.query._skip) || 0;
    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate({
        path: "sentFriendRequests",
        select: "fullname avatar username",
      });

      let sentFriendRequests = account.sentFriendRequests;

      if (sentFriendRequests.length > 0) {
        sentFriendRequests = sentFriendRequests
          .map((request) => {
            if (request.avatar) {
              request.avatar = pathAccount + request.avatar;
            }
            return request;
          })
          .slice(skip, skip + limit);
      }

      return res.json({
        status: 200,
        message: "Get sent friend requests successful",
        sentFriendRequests,
      });
    } catch (error) {
      return res.json({ status: 500, message: "Internal Server Error", error });
    }
  },

  getReceivedFriendRequests: async (req, res) => {
    const pathAccount = "accountImage/";

    try {
      const accountId = req.account.id;

      const account = await Account.findById(accountId).populate({
        path: "receivedFriendRequests",
        select: "fullname avatar username createAt",
      });

      let receivedFriendRequests = account.receivedFriendRequests;

      if (receivedFriendRequests.length > 0) {
        receivedFriendRequests = receivedFriendRequests.map((request) => {
          if (request.avatar) {
            request.avatar = pathAccount + request.avatar;
          }
          return request;
        });
      }

      return res.json({
        status: 200,
        message: "Get received friend requests successful",
        receivedFriendRequests,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }
  },
};

module.exports = AccountController;
