import React, { useEffect, useState } from "react";
import "./CreatePost.css";
import Avtar from "../Avtar/Avtar";
import { BiImageAdd } from "react-icons/bi";
import { axiosClient } from "../../Utils/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { getMyProfile, setLoading } from "../../Redux/Slices/appConfigueSlice";
import { getUserProfile } from "../../Redux/Slices/postSlice";

function CreatePost() {
  const myprofile = useSelector((state) => state.appConfigeReducer.myProfile);

  useEffect(() => {}, [myprofile]);
  function postimagehandelchanged(e) {
    e.preventDefault();
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setpostimage(fileReader.result);
        // console.log("img data", fileReader.result);
      }
    };
  }

  const dispatch = useDispatch();

  const handelpostsubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const result = await axiosClient.post("/postapi/createpost", {
        caption,
        postimage,
      });
      console.log(result);
      dispatch(
        getUserProfile({
          userId: myprofile?._id,
        })
      );
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(setLoading(false));
      setcaption("  ");
      setpostimage(" ");
    }
  };

  const [postimage, setpostimage] = useState("");
  const [caption, setcaption] = useState("");

  return (
    <div className="cretepost">
      <div className="createpost-leftpart">
        <Avtar src={myprofile?.avatar?.url} />
      </div>
      <div className="createpost-rightpart">
        <input
          value={caption}
          type="text"
          className="captionInput"
          placeholder="What's on your mind?"
          onChange={(e) => {
            setcaption(e.target.value);
          }}
        />
        {postimage && (
          <div className="postcreate-image-container">
            <img src={postimage} className="post-image" alt="" />
          </div>
        )}

        <div className="createimg-bottom-part">
          <div className="file-selectorImage">
            <label htmlFor="inputimage" className="labelimg">
              <BiImageAdd />
            </label>
            <input
              type="file"
              accept="image/*"
              id="inputimage"
              className="inputimage"
              onChange={postimagehandelchanged}
            />
          </div>
          <button className="createpost-submit-btn" onClick={handelpostsubmit}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
