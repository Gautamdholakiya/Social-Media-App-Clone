import axios from "axios";
import {
  getItem,
  removeItem,
  ACCESS_TOKEN_KEY,
  setItem,
} from "./localStorageManager";
import store from "../Redux/store";
import { setLoading, showToast } from "../Redux/Slices/appConfigueSlice";
import { TOAST_FAILURE } from "../App";

export const axiosClient = axios.create({
  baseURL: "http://localhost:4000", //BACKEND SERVER LOCAL HOST
  withCredentials: true,
});

//When send u request with middleware bt user dont know how to send

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(ACCESS_TOKEN_KEY);
  // console.log(accessToken);
  request.headers["Authorization"] = `Bearer ${accessToken}`;

  return request;
});

//Anuj Bhaiya response code

axiosClient.interceptors.response.use(
  async (respone) => {
    const data = respone.data;
    // console.log(data);
    if (data.status === "ok") {
      return data;
    }

    const originalRequest = respone.config;
    const statusCode = data.statusCode;
    const error = data.message;

    if (statusCode === 401 && !originalRequest._retry) {
      // means the access token has expired
      originalRequest._retry = true;

      const response = await axios
        .create({
          withCredentials: true,
        })
        .get("http://localhost:4000/auth/refresh/auth/refresh");

      if (response.data.status === "ok") {
        setItem(ACCESS_TOKEN_KEY, response.result.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.result.accessToken}`;

        return axios(originalRequest);
      } else {
        removeItem(ACCESS_TOKEN_KEY);
        window.location.replace("/login", "_self");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
  // async (error) => {
  //   store.dispatch(setLoading(false));
  //   store.dispatch(
  //     showToast({
  //       type: TOAST_FAILURE,
  //       message: error.message,
  //     })
  //   );
  //   return Promise.reject(error);
  // }
);
