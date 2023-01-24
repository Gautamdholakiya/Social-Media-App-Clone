import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../Utils/axiosClient";

function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  async function handelsubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      navigate("/Login");
      // console.log(result);
    } catch (error) {
      // console.log(error);
    }
  }

  return (
    <div className="signup">
      <div className="signup-box">
        <h1 className="heading">SignUp</h1>
        <form onSubmit={handelsubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="name"
            id="name"
            maxLength={20}
            minLength={2}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          <label htmlFor="password">password</label>
          <input
            type="password"
            className="password"
            id="password"
            maxLength={12}
            minLength={6}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button type="submit" onSubmit={handelsubmit}>
            Submit
          </button>

          <p>
            You Have A Alredy Account? <Link to="/Login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Sign;
