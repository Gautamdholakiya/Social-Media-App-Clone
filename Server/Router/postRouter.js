const router = require("express").Router();
const postRouter = require("../Controller/postController");
const requireUser = require("../Middleware/requierUser");

router.post("/createpost", requireUser, postRouter.createPostController);
router.post("/likeUnlike", requireUser, postRouter.likeUnlikeController);
router.put("/updateRequest", requireUser, postRouter.updatePostController);
router.delete("/deletePost", requireUser, postRouter.deletePostController);

module.exports = router;
