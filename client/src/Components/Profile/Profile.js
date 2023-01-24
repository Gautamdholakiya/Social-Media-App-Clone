import React, { useEffect, useState } from "react";
import "./Profile.css";
import Post from "../Post/Post";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "../../Redux/Slices/postSlice";
import CreatePost from "../CreatePost/CreatePost";
import userimage from "../assets/user.png";
import { followUnfollowData } from "../../Redux/Slices/feedSlices";

function Profile() {
  const navigate = useNavigate();
  const params = useParams();

  const userProfile = useSelector((state) => state.postreducer.userProfile);
  const myProfile = useSelector((state) => state.appConfigeReducer.myProfile);
  const feedData = useSelector((state) => state.feedDataReducer.feedData);

  // console.log(myProfile);
  console.log(userProfile);
  const dispatch = useDispatch();
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [isfollowing, setFollowing] = useState(false);

  useEffect(() => {
    dispatch(
      getUserProfile({
        userId: params.userId,
      })
    );
    setFollowing(
      feedData?.following?.find((item) => item._id == params.userId)
    );
    setIsMyProfile(myProfile?._id === params.userId);
  }, [myProfile, params.userId, feedData]);

  function followUnfollowHandel() {
    dispatch(
      followUnfollowData({
        userIdToFollow: params.userId,
      })
    );
  }
  return (
    <div className="profile">
      <div className="container-profile">
        <div className="profile-left-side">
          {isMyProfile && <CreatePost />}
          {userProfile?.posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        <div className="profile-right-side">
          <div className="profile-card">
            <img src={userProfile?.avatar?.url} alt="" />
            <h2 className="user-name">{userProfile?.name}</h2>
            <div className="follower-info">
              <div className="followers-count">
                <h4 className="follower-count">
                  {userProfile?.followers?.length}
                </h4>
                <p>Followers</p>
              </div>
              <div className="followings-count">
                <h4 className="following-count">
                  {userProfile?.following?.length}
                </h4>
                <p>Followings</p>
              </div>
            </div>
            <p className="profile-bio">{userProfile?.bio}</p>
            <div className="update-follow-btn">
              {!isMyProfile && (
                <button onClick={followUnfollowHandel} className="follow-btn">
                  {isfollowing ? "Unfollow" : "Follow"}
                </button>
              )}
              {isMyProfile && (
                <button
                  className="update-profile-btn"
                  onClick={() => {
                    navigate("/updateProfile");
                  }}
                >
                  Update Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
