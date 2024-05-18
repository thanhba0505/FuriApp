const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
// const dotenv = require("dotenv");
// dotenv.config();

let refreshTokens = [];

const AccountController = {
  registerAccount: async (req, res) => {
    try {
      const { username, password, fullName } = req.body;

      if (username.length < 8 || username.length > 30) {
        return res
          .status(400)
          .json({ message: "Username must be between 10 and 30 characters" });
      }

      const existingAccount = await Account.findOne({
        username: username,
      });

      if (existingAccount) {
        return res.status(409).json({ message: "Username already exists" });
      }

      if (fullName.length < 4 || fullName.length > 50) {
        return res
          .status(400)
          .json({ message: "Full name must be between 10 and 50 characters" });
      }

      if (password.length < 8 || password.length > 20) {
        return res
          .status(400)
          .json({ message: "Password must be between 8 and 20 characters" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        fullName: fullName,
      });

      // Save new user to DB
      const user = await newUser.save();

      // Create new account with reference to the new user
      const newAccount = new Account({
        username: username,
        password: hashed,
        user: user._id, // Reference to the user
      });

      // Save account to DB
      await newAccount.save();

      return res.status(200).json({ message: "Registration successful" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
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
      process.env.FURI_JWT_ACCESS_KEY,
      { expiresIn: "365d" }
    );
  },

  loginAccount: async (req, res) => {
    try {
      const account = await Account.findOne({
        username: req.body.username,
      }).populate("user");

      if (!account) {
        return res.status(404).json({ message: "Wrong username" });
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        account.password
      );

      if (!validPassword) {
        return res.status(404).json({ message: "Wrong password" });
      }

      if (account && validPassword) {
        const accessToken = AccountController.generateAccessToken(account);
        const refreshToken = AccountController.generateRefreshToken(account);

        refreshTokens.push(refreshToken);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false, // Deloy -> true
          path: "/",
          sameSite: "strict",
        });

        const { password, ...others } = account._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }

    jwt.verify(
      refreshToken,
      process.env.FURI_JWT_ACCESS_KEY,
      (err, account) => {
        if (err) {
          return res.status(403).json("Refresh token is not valid");
        }

        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = AccountController.generateAccessToken(account);
        const newRefreshToken = AccountController.generateRefreshToken(account);

        refreshTokens.push(newRefreshToken);

        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: false, // Deloy -> true
          path: "/",
          sameSite: "strict",
        });

        return res.status(200).json({ accessToken: newAccessToken });
      }
    );
  },

  logoutAccount: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Logged out");
  },
};

module.exports = AccountController;
