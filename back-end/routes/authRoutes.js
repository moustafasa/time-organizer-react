const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/refresh", refresh);
authRouter.get("/logout", logout);

module.exports = authRouter;
