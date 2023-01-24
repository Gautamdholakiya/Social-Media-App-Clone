const requierUser = require("../Middleware/requierUser");
const userController = require("../Controller/userController");

const router = require("express").Router();

router.post("/follow", requierUser, userController.userFollowToUnfollow);
router.get("/getFeedData", requierUser, userController.getFollowingAllPost);
router.get("/getMyAllPost", requierUser, userController.getMyAllPost);
router.post("/getUserPost", requierUser, userController.getUserPost);
router.delete("/deleteUser", requierUser, userController.deleteUserProfile);
router.get("/myProfile", requierUser, userController.myProfile);
router.put("/", requierUser, userController.updateMyProfile);
router.post("/getuserprofile", requierUser, userController.getUserProfile);

module.exports = router;
