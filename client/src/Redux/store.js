import { configureStore } from "@reduxjs/toolkit";
import appConfigeReducer from "./Slices/appConfigueSlice";
import postreducer from "./Slices/postSlice";
import feedDataReducer from "./Slices/feedSlices";

export default configureStore({
  reducer: {
    appConfigeReducer,
    postreducer,
    feedDataReducer,
  },
});
