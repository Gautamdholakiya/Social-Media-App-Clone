import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../Utils/axiosClient";

export const getMyProfile = createAsyncThunk(
  "user/myProfile",
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const response = await axiosClient.get("/user/myProfile");
      // console.log("Api Called", response.result.user);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  }
);

export const updateMyProfile = createAsyncThunk(
  "/user/updateMyProfile",
  async (body, thunkApi) => {
    try {
      thunkApi.dispatch(setLoading(true));
      const response = await axiosClient.put("/user/", body);
      // console.log("Api Called", response);
      return response.result;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      thunkApi.dispatch(setLoading(false));
    }
  }
);

const appConfigueSlice = createSlice({
  name: "appConfigueSlice",
  initialState: {
    isLoading: false,
    toastData: {},
    myProfile: {},
  },
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    showToast: (state, action) => {
      state.toastData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.myProfile = action.payload.user;
      });
  },
});

export default appConfigueSlice.reducer;
export const { setLoading, showToast } = appConfigueSlice.actions;
