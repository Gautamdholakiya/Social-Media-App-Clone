import React, { useEffect, useState } from "react";
import "./UpdateProfile.css";
import userImg from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../Redux/Slices/appConfigueSlice";

function UpdateProfile() {
  const myprofile = useSelector((state) => state.appConfigeReducer.myProfile);
  // console.log(myprofile);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [userimg, setUserImg] = useState("");

  const dispatch = useDispatch();
  //onchange event to start

  useEffect(() => {
    setName(myprofile?.name || " ");
    setBio(myprofile?.bio || " ");
    setUserImg(myprofile?.avatar?.url || userImg);
  }, [myprofile]);

  function userimagehandel(e) {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (fileReader.readyState === fileReader.DONE) {
        setUserImg(fileReader.result);
        // console.log("img data", fileReader.result);
      }
    };
  }

  function updateProfileSubmitbuttonhandel(e) {
    e.preventDefault();
    dispatch(
      updateMyProfile({
        name,
        bio,
        userimg,
      })
    );
  }

  return (
    <div className="update-profile">
      <div className="update-profile-container">
        <div className="update-left-side">
          <div className="input-user-img">
            <label htmlFor="inputImage" className="userimage">
              <img
                src={userimg ? userimg : userImg}
                alt={name}
                className="user-img"
              />
            </label>
            <input
              className="inputImage"
              id="inputImage"
              type="file"
              accept="image/*"
              onChange={userimagehandel}
            />
          </div>
        </div>
        <div className="update-right-side">
          <form>
            <h1>Upadte Your Profile Here</h1>
            <input
              value={name}
              placeholder="Your Name"
              type="text"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              value={bio}
              placeholder="Your Bio"
              type="text"
              onChange={(e) => {
                setBio(e.target.value);
              }}
            />
            <div className="update-profile-btn">
              <button onClick={updateProfileSubmitbuttonhandel}>
                Submit Profile
              </button>
              <button className="dlt-btn"> Delete Account</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;
