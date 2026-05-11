const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const AuthController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", AuthController.login);

module.exports = router;
