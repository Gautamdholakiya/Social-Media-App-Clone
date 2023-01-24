import React from "react";
import { useNavigate } from "react-router-dom";
import Avtar from "../Avtar/Avtar";
import { AiOutlineLogout } from "react-icons/ai";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Redux/Slices/appConfigueSlice";
import { axiosClient } from "../../Utils/axiosClient";
import { ACCESS_TOKEN_KEY, removeItem } from "../../Utils/localStorageManager";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleDispatch = useDispatch();
  const myProfile = useSelector((state) => state.appConfigeReducer.myProfile);

  function toggleLoadingbar() {
    toggleDispatch(setLoading(true));
  }

  async function handellogout() {
    try {
      dispatch(setLoading(true));
      await axiosClient.post("/auth/logout");
      removeItem(ACCESS_TOKEN_KEY);
      navigate("/Login");
      dispatch(setLoading(false));
    } catch (e) {}
  }

  return (
    <>
      <div className="navbar">
        <div className="navbar-container">
          <div className="navbar-left-side">
            <h2 className="hover-link" onClick={() => navigate("/")}>
              Social Media
            </h2>
          </div>
          <div className="navbar-right-side">
            <div
              className="profile-btn hover-link "
              onClick={() => navigate(`/profile/${myProfile?._id}`)}
            >
              <Avtar src={myProfile?.avatar?.url} />
            </div>
            <div className="logout-btn hover-link" onClick={toggleLoadingbar}>
              <AiOutlineLogout onClick={handellogout} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
