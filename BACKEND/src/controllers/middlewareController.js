const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/BlackListToken");
const Account = require("../models/Account");

const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accessToken = token.split(" ")[1];

      const accessTokenExists = await BlackListToken.findOne({
        token: accessToken,
      });

      if (accessTokenExists) {
        return res.json({ status: 403, message: "Token is not valid" });
      }

      jwt.verify(
        accessToken,
        process.env.FURI_JWT_ACCESS_KEY,
        async (err, account) => {
          if (err) {
            return res.json({ status: 403, message: "Token is not valid" });
          }

          const accountID = await Account.findById(account.id);
          if (!accountID) {
            return res.json({ status: 404, message: "Account does not exist" });
          }

          req.account = account;
          next();
        }
      );
    } else {
      return res.json({
        status: 401,
        message: "You're not authenticated (middleware)",
      });
    }
  },
};

module.exports = middlewareController;
