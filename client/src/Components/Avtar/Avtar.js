import React from "react";
import userImg from "../assets/user.png";
import "./Avtar.css";

function Avtar({ src }) {
  return (
    <div className="Avtar">
      <img src={src ? src : userImg} alt="User Profile Picture" />
    </div>
  );
}

export default Avtar;
