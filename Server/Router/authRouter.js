const router = require("express").Router();
const authController = require("../Controller/aurhController");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);
router.post("/refresh", authController.refreshTokenController);
router.post("/logout", authController.logOutController);

module.exports = router;
