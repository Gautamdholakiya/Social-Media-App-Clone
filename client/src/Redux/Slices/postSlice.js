import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../Utils/axiosClient";
import { setLoading } from "./appConfigueSlice";

export const getUserProfile = createAsyncThunk(
  "user/getUserProfile",
  async (body, thunkApi) => {
    // console.log("here");
    try {
      thunkApi.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/getuserprofile", body);
      console.log("Api Called", response.result);
      // console.log(response);
      return response.result;
    } catch (error) {
      // console.log(error);
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  }
);

export const postLikeOrUnlike = createAsyncThunk(
  "/post/like&unlike",
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const response = await axiosClient.post("/postapi/likeUnlike", body);
      // console.log("profile liek", response.result);
      return response.result.post;
    } catch (error) {
      // console.log(error);
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  }
);

const postSlice = createSlice({
  name: "postSlice",
  initialState: {
    userProfile: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
      })
      .addCase(postLikeOrUnlike.fulfilled, (state, action) => {
        const post = action.payload;

        const index = state?.userProfile?.posts?.findIndex(
          (item) => item._id === post._id
        );
        if (index && index != -1) {
          state.userProfile.posts[index] = post;
        }
      });
  },
});

export default postSlice.reducer;
