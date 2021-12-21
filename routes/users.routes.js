const usersController = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.post("/refresh-token", usersController.refreshToken);

//TODO #############Code Needed in the Future! ###########################
// router.get("/user-profile", usersController.userProfile);
// router.post("/otpLogin", usersController.otpLogin);
// router.post("/verifyOTP", usersController.verifyOTP);

module.exports = router;