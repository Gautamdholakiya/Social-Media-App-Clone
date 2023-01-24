const User = require("../Model/User");
const jwt = require("jsonwebtoken");
const { error, sucess } = require("../Utills/responseWrapper");
const { post } = require("../Router/userRouter");
const Post = require("../Model/Post");
const { mapPost } = require("../Utills/createPostwrapper");
const cloudinary = require("cloudinary").v2;

const userFollowToUnfollow = async (req, res) => {
  try {
    const { userIdToFollow } = req.body;

    const refreshToken = req.cookies.jwt;
    const decoded = await jwt.verify(
      refreshToken,
      process.env.ACESS_REFRESH_KEY
    );

    const curentUserId = decoded._id;

    const userToFollow = await User.findById(userIdToFollow);
    const curUser = await User.findById(curentUserId);

    if (curentUserId === userIdToFollow) {
      return res.send(error(500, "Cannot Follow Your Self"));
    }

    if (!userToFollow) {
      return res.send(error(401, "User To Follow Reqired"));
    }

    if (curUser.following.includes(userIdToFollow)) {
      const followingIndex = curUser.following.indexOf(userIdToFollow);
      curUser.following.splice(followingIndex, 1);

      //   console.log(followingIndex);

      const followerIndex = userToFollow.followers.indexOf(curentUserId);
      userToFollow.followers.splice(followerIndex, 1);
    } else {
      userToFollow.followers.push(curentUserId);
      curUser.following.push(userIdToFollow);
    }
    await curUser.save();
    await userToFollow.save();
    return res.send(sucess(200, { user: userToFollow }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getFollowingAllPost = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    const decode = await jwt.verify(
      refreshToken,
      process.env.ACESS_REFRESH_KEY
    );
    const currentId = decode._id;

    const currnetuser = await User.findById(currentId).populate("following");

    // console.log("this is user", currnetuser);
    const fullpost = await Post.find({
      owner: {
        $in: currnetuser.following,
      },
    }).populate("owner");
    // console.log("this is post", fullpost);

    const post = fullpost.map((item) => mapPost(item, decode._id)).reverse();

    const followingsId = currnetuser.following.map((item) => item._id);
    followingsId.push(decode._id);

    // console.log("following id is ", followingsId);

    const suggesitons = await User.find({
      _id: {
        $nin: followingsId,
      },
    });
    return res.send(sucess(200, { ...currnetuser._doc, suggesitons, post }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getMyAllPost = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    const decode = jwt.verify(refreshToken, process.env.ACESS_REFRESH_KEY);
    const currentUserId = decode._id;

    // const currentUser = User.findById(currentUserId);
    const alluserpost = await Post.find({
      owner: currentUserId,
    }).populate("likes");

    return res.send(
      sucess(200, {
        alluserpost,
      })
    );
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const getUserPost = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.send(error(500, "User Id Not Found"));
    }
    // const refreshToken = req.cookies.jwt;

    // const decode = jwt.verify(refreshToken, process.env.ACESS_REFRESH_KEY);

    // const userId = decode._id;

    const userPost = await Post.find({
      owner: userId,
    });

    return res.send(sucess(200, { userPost }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const refreshtoken = req.cookies.jwt;
    const decode = jwt.verify(refreshtoken, process.env.ACESS_REFRESH_KEY);

    const currentUserId = decode._id;
    const currentUser = await User.findById(currentUserId);

    //Delete All Post

    const allPost = await Post.deleteMany({
      owner: currentUserId,
    });

    // console.log(currentUser);

    //Remove My Self From Followers Following
    currentUser.followers.forEach(async (followerId) => {
      const follower = await User.findById(followerId);
      const index = follower.following.indexOf(currentUserId);
      follower.following.splice(index, 1);
      await follower.save();
    });

    //Remove MySelf From MyFollowing Followers
    currentUser.following.forEach(async (followinnId) => {
      const following = await User.findById(followinnId);
      const index = following.followers.indexOf(currentUserId);
      following.followers.splice(index, 1);
      await following.save();
    });

    //Remove My Self From POst Likes
    const allPostForLikes = await Post.find();

    allPostForLikes.forEach(async (post) => {
      const index = post.likes.indexOf(currentUserId);
      post.likes.splice(index, 1);
      await post.save();
    });

    //Remove For Self
    await currentUser.remove();

    return res.send(sucess(200, "Delet User Sucessfully"));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const myProfile = async (req, res) => {
  try {
    const refreshToken = req.cookies.jwt;

    const decode = jwt.verify(refreshToken, process.env.ACESS_REFRESH_KEY);

    const user_id = decode._id;
    // console.log(user_id);

    const user = await User.findById(user_id);
    // console.log(user);

    return res.send(sucess(200, { user }));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, userImg } = req.body;

    const refreshToken = req.cookies.jwt;

    const decode = jwt.verify(refreshToken, process.env.ACESS_REFRESH_KEY);

    const user_id = decode._id;

    const user = await User.findById(user_id);

    // console.log(user);

    // if (!user) {
    //   return res.send(error(500, "User Is Not Present"));
    // }

    if (name) {
      user.name = name;
    }
    // console.log(name);
    if (bio) {
      user.bio = bio;
    }
    if (userImg) {
      const cloudImage = await cloudinary.uploader.upload(userImg, {
        folder: "UserDp",
      });
      // console.log(cloudImage);

      user.avatar = {
        url: cloudImage.secure_url,
        publicId: cloudImage.public_id,
      };
    }

    await user.save();

    return res.send(sucess(200, { user }));
  } catch (e) {
    console.log(e);
    return res.send(error(500, e.message));
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "owner",
      },
    });
    console.log(user);
    const fullpost = user.posts;
    const posts = fullpost.map((item) => mapPost(item, req._id)).reverse();

    console.log(posts);

    return res.send(sucess(200, { ...user._doc, posts }));
  } catch (e) {
    return res.send(error(500, e.messaege));
  }
};

module.exports = {
  userFollowToUnfollow,
  getFollowingAllPost,
  getMyAllPost,
  getUserPost,
  deleteUserProfile,
  myProfile,
  updateMyProfile,
  getUserProfile,
};
