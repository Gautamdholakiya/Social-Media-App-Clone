import React, { useEffect } from "react";
import "./Feed.css";
import Post from "../Post/Post";
import FollowerList from "../Follower-List/FollowerList";
import CreatePost from "../CreatePost/CreatePost";
import { useDispatch, useSelector } from "react-redux";
import { getFeedData } from "../../Redux/Slices/feedSlices";

function Feed() {
  const dispatch = useDispatch();
  const feedData = useSelector((state) => state.feedDataReducer.feedData);
  // console.log("feed data us", feedData);
  useEffect(() => {
    dispatch(getFeedData());
  }, [dispatch]);

  return (
    <div className="feeds">
      <div className="container-globel">
        <div className="feed-left-side">
          <CreatePost />
          {feedData?.post?.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>
        <div className="feed-right-side">
          <h3 className="title-reight-side">You Are Following</h3>
          <div className="follower-list">
            {feedData?.following?.map((user, index) => (
              <FollowerList key={index} user={user} />
            ))}
          </div>
          <h3 className="title-suggeston">Your Suggestions</h3>
          <div className="suggestion-list">
            {feedData?.suggesitons?.map((user, index) => (
              <FollowerList key={index} user={user} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
