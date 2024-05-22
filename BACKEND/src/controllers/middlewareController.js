const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/BlackListToken");

const middlewareController = {
  verifyToken: async (req, res, next) => {
    const token = req.headers.token;

    if (token) {
      const accessToken = token.split(" ")[1];

      const accessTokenExists = await BlackListToken.findOne({ token: accessToken });

      if (accessTokenExists) {
        return res.status(403).json({ message: "Token is not valid" });
      }

      jwt.verify(
        accessToken,
        process.env.FURI_JWT_ACCESS_KEY,
        (err, account) => {
          if (err) {
            return res.status(403).json({ message: "Token is not valid" });
          }
          req.account = account;
          next();
        }
      );
    } else {
      return res.status(401).json({ message: "You're not authenticated" });
    }
  },

  verifyTokenAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      // const token = req.headers.token;
      // const accessToken = token.split(" ")[1];

      // jwt.verify(
      //   accessToken,
      //   process.env.FURI_JWT_ACCESS_KEY,
      //   (err, account) => {
      //     if (account.id == ) {

      //     }
      //     return res.status(403).json(account.id);
      //     next();
      //   }
      // );
      if (req.user.id == req.params.id || req.user.admin) {
        next();
      } else {
        res
          .status(403)
          .json({ message: "You're not authorized to perform this action" });
      }
    });
  },
};

module.exports = middlewareController;
