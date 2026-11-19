import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notification: null,
  },
  reducers: {
    showNotification(state, action) {
      state.notification = {
        status: action.payload.state,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    hideNotification(state) {
      state.notification = null;
    },
  },
});

export default notificationSlice.reducer;
export const notificationActions = notificationSlice.actions;
