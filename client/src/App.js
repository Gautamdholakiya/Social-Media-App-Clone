import "./App.css";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/Signup/Sign";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Feed from "./Components/Feed/Feed";
import Profile from "./Components/Profile/Profile";
import RequierUser from "./Components/RequierUser";
import UpdateProfile from "./Components/Update Profile/UpdateProfile";
import LoadingBar from "react-top-loading-bar";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import OnlyIfnotLogin from "./Components/OnlyIfnotLogin";
import toast, { Toaster } from "react-hot-toast";

export const TOAST_SUCCESS = "toast_success";
export const TOAST_FAILURE = "toast_failure";

function App() {
  const isLoading = useSelector((state) => state.appConfigeReducer.isLoading);
  // const toastData = useSelector((state) => state?.appConfigReducer?.toastData);
  const loadingRef = useRef(null);

  // useEffect(() => {
  //   switch (toastData?.type) {
  //     case TOAST_SUCCESS:
  //       toast.success(toastData.message);
  //       break;
  //     case TOAST_FAILURE:
  //       toast.error(toastData.message);
  //       break;
  //   }
  // }, [toastData]);

  useEffect(() => {
    if (isLoading) {
      loadingRef.current?.continuousStart();
    } else {
      loadingRef.current?.complete();
    }
  }, [isLoading]);

  return (
    <div className="app">
      <LoadingBar loaderSpeed="1500" color="#f11946" ref={loadingRef} />
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route element={<RequierUser />}>
          <Route element={<Home />}>
            <Route path="/" element={<Feed />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/updateProfile" element={<UpdateProfile />} />
          </Route>
        </Route>
        <Route element={<OnlyIfnotLogin />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/Login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
