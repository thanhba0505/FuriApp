const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RefreshToken = require("../models/RefreshToken");
const BlackListToken = require("../models/BlackListToken");

const AccountController = {
  registerAccount: async (req, res) => {
    try {
      const { username, password, fullname } = req.body;

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

      if (fullname.length < 4 || fullname.length > 50) {
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

      const newAccount = new Account({
        username: username,
        password: hashed,
        fullname: fullname,
      });

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
      process.env.FURI_JWT_REFRESH_KEY,
      { expiresIn: "365d" }
    );
  },

  loginAccount: async (req, res) => {
    try {
      const account = await Account.findOne({
        username: req.body.username,
      })

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

        await RefreshToken.create({ token: refreshToken });

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

    try {
      const tokenExists = await RefreshToken.exists({ token: refreshToken });

      if (!tokenExists) {
        return res.status(403).json("Refresh token is not valid");
      }

      jwt.verify(
        refreshToken,
        process.env.FURI_JWT_REFRESH_KEY,
        async (err, account) => {
          if (err) {
            return res.status(403).json("Refresh token is not valid");
          }

          await RefreshToken.deleteOne({ token: refreshToken });

          const newAccessToken = AccountController.generateAccessToken(account);
          const newRefreshToken =
            AccountController.generateRefreshToken(account);

          await RefreshToken.create({ token: newRefreshToken });

          res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false, // Deloy -> true
            path: "/",
            sameSite: "strict",
          });

          return res.status(200).json({ accessToken: newAccessToken });
        }
      );
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  logoutAccount: async (req, res) => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      const accessToken = req.headers.token?.split(" ")[1];

      if (!refreshToken || !accessToken) {
        return res.status(401).json({ message: "You're not authenticated" });
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

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = AccountController;
