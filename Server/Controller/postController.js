const { sucess, error } = require("../Utills/responseWrapper");
const Post = require("../Model/Post");
const User = require("../Model/User");
const cloudinary = require("cloudinary").v2;

const jwt = require("jsonwebtoken");
const { mapPost } = require("../Utills/createPostwrapper");

const createPostController = async (req, res) => {
  try {
    const { caption, postimage } = req.body;
    // const owner = req._id;
    if (!caption) {
      return res.send(error(400, "Caption is Required"));
    }

    if (!postimage) {
      return res.send(error(400, "Post is Required"));
    }
    // console.log(req.cookies.jwt);

    const refreshToken = req.cookies.jwt;
    const decoded = await jwt.verify(
      refreshToken,
      process.env.ACESS_REFRESH_KEY
    );

    const auth_id = decoded._id;
    // console.log(_id);

    const user = await User.findById(auth_id);
    const owner = auth_id;

    // console.log(user);

    const cloudeImg = await cloudinary.uploader.upload(postimage, {
      folder: "postimage",
    });
    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudeImg.public_id,
        url: cloudeImg.url,
      },
    });

    // console.log(post._id);

    user.posts.push(post);
    await user.save();

    return res.send(sucess(201, { post }));
  } catch (e) {
    // console.log("This is my error", e);
    return res.send(error(500, e.message));
  }
};

const likeUnlikeController = async (req, res) => {
  try {
    const { postId } = req.body;

    const refreshToken = req.cookies.jwt;

    const decode = jwt.verify(refreshToken, process.env.ACESS_REFRESH_KEY);

    const currentid = decode._id;
    // console.log(currentid);
    const post = await Post.findById(postId).populate("owner");

    if (!post) {
      res.send(error(500, "Post is Required"));
    }
    if (post.likes.includes(currentid)) {
      const index = await post.likes.indexOf(currentid);
      post.likes.splice(index, 1);
    } else {
      post.likes.push(currentid);
    }
    await post.save();
    return res.send(sucess(200, { post: mapPost(post, req._id) }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;

    const refresToken = req.cookies.jwt;
    const decode = jwt.verify(refresToken, process.env.ACESS_REFRESH_KEY);

    const currentUser = decode._id;

    // const currentUser = req_id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.send(error(500, "Post Is Not Found"));
    }

    if (post.owner.toString() !== currentUser) {
      return res.send(error(500, "Only Owner Can Update post"));
    }

    if (caption) {
      post.caption = caption;
    }

    await post.save();

    return res.send(sucess(200, post));
  } catch (er) {
    return res.send(error(501, e.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;

    const refresToken = req.cookies.jwt;
    const decode = jwt.verify(refresToken, process.env.ACESS_REFRESH_KEY);

    const auth_Id = decode._id;

    // console.log(`auth user is ${auth_Id}`);

    const curentUser = await User.findById(auth_Id);

    // console.log(curentUser);

    const post = await Post.findById(postId);

    // console.log(post);

    if (!post) {
      return res.send(error(500, "Post Not Found"));
    }

    // console.log(`post owner id  ${post.owner._id}`);

    if (post.owner._id.toString() !== curentUser) {
      return res.send(error(500, "Only Owner Can delete post"));
    }

    const index = curentUser.posts.indexOf(postId);
    curentUser.posts.splice(index, 1);

    await curentUser.save();
    await post.remove();

    return res.send(sucess(200, "Post Delete SucessFully"));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

module.exports = {
  createPostController,
  likeUnlikeController,
  deletePostController,
  updatePostController,
};
