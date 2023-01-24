import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { followUnfollowData } from "../../Redux/Slices/feedSlices";
import Avtar from "../Avtar/Avtar";
import "./FollowerList.css";

function FollowerList({ user }) {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  const [isfollowing, setFollowing] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setFollowing(feedData?.following?.find((item) => item._id == user._id));
  }, [feedData]);

  function followUnfollowHandel() {
    dispatch(
      followUnfollowData({
        userIdToFollow: user._id,
      })
    );
  }
  return (
    <div className="follower-main-list">
      <div
        className="user-info"
        onClick={() => {
          navigate(`/profile/${user._id}`);
        }}
      >
        <Avtar src={user?.avatar?.url} />
        <h4 className="User-name">{user?.name}</h4>
      </div>
      <button onClick={followUnfollowHandel} className="follow-btn">
        {isfollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  );
}

export default FollowerList;
