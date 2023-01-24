import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router";
import Navbar from "../../Components/Navbar/Navbar";
import { getMyProfile } from "../../Redux/Slices/appConfigueSlice";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyProfile());
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default Home;
