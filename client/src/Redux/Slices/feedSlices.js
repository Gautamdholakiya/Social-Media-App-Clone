import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../Utils/axiosClient";
import { setLoading } from "./appConfigueSlice";
import { postLikeOrUnlike } from "./postSlice";

export const followUnfollowData = createAsyncThunk(
  "user/followunfollowdata",
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const response = await axiosClient.post("/user/follow", body);
      // console.log("follow Called", response.result);
      console.log("user following", response.result);
      return response.result.user;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  }
);

export const getFeedData = createAsyncThunk("user/getFeedData", async () => {
  try {
    const response = await axiosClient.get("/user/getFeedData");
    // console.log("userProfile", response.result);
    return response.result;
  } catch (error) {
    return Promise.reject(error);
  }
});

const feedSlices = createSlice({
  name: "feedSlices",
  initialState: {
    feedData: {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(postLikeOrUnlike.fulfilled, (state, action) => {
        const post = action.payload;

        const index = state?.feedData?.post?.findIndex(
          (item) => item._id === post._id
        );
        console.log("feed like", post, index);
        if (index != undefined && index != -1) {
          state.feedData.post[index] = post;
        }
      })
      .addCase(followUnfollowData.fulfilled, (state, action) => {
        const user = action.payload;
        console.log(user);
        const index = state?.feedData?.following.findIndex(
          (item) => item._id == user._id
        );
        if (index != -1) {
          state?.feedData.following.splice(index, 1);
        } else {
          state?.feedData.following.push(user);
        }
      });
  },
});

export default feedSlices.reducer;
