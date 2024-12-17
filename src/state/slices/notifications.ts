import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type Notification } from "@prisma/client";
import { getNotificationsByUserId } from "@/server/actions/notification";
import { type SliceType } from "../types";

const initialState: SliceType<Notification[]> = {
  status: "idle",
  data: null,
  error: null,
};

export const getSliceNotifications = createAsyncThunk(
  "notifications/getSliceNotifications",
  async (userId: string) => {
    const notifications = await getNotificationsByUserId(userId);

    return notifications;
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as SliceType<Notification[]>,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSliceNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSliceNotifications.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "success";
      })
      .addCase(getSliceNotifications.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "";
      });
  },
});

export default notificationsSlice.reducer;
