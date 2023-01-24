import React from "react";
import "./Post.css";
import Avtar from "../Avtar/Avtar";
import { CiHeart } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { postLikeOrUnlike } from "../../Redux/Slices/postSlice";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../Redux/Slices/appConfigueSlice";
import { TOAST_SUCCESS } from "../../App";

function Post({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  async function handellikeunlike() {
    dispatch(
      showToast({
        type: TOAST_SUCCESS,
        message: "Like Or Unlike",
      })
    );
    dispatch(
      postLikeOrUnlike({
        postId: post._id,
      })
    );
  }
  return (
    <div className="post">
      <div className="post-container">
        <div
          className="post-heading"
          onClick={() => {
            navigate(`/profile/${post.owner._id}`);
          }}
        >
          <Avtar src={post?.owner?.avatar?.url} />
          <h4>{post?.owner?.name}</h4>
        </div>
        <div className="post-content">
          <img src={post?.image?.url} alt="" />
        </div>
        <div className="post-footer">
          <div className="like">
            {post.isLiked ? (
              <AiFillHeart
                style={{ color: "red" }}
                className="hert-icon"
                onClick={handellikeunlike}
              />
            ) : (
              <CiHeart className="hert-icon" onClick={handellikeunlike} />
            )}
            <h4>{post?.likesCount} Likes</h4>
          </div>
          <p className="post-caption">{post?.caption}</p>
          <h6 className="post-timing">{post?.timeAgo}</h6>
        </div>
      </div>
    </div>
  );
}

export default Post;
