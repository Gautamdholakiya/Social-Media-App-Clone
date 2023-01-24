import React, { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../../Utils/axiosClient";
import { ACCESS_TOKEN_KEY, setItem } from "../../Utils/localStorageManager";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosClient.post("auth/login", {
        email,
        password,
      });
      // console.log(response);
      setItem(ACCESS_TOKEN_KEY, response.result.accessToken);
      // console.log(ok);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login-box">
        <h1 className="heading">Login</h1>
        <form onSubmit={handelSubmit}>
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
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <button type="submit" onSubmit={handelSubmit}>
            Submit
          </button>
        </form>

        <p>
          Do Not Have An Account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
