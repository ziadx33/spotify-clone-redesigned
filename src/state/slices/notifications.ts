import { createSlice } from "@reduxjs/toolkit";
import { type Notification } from "@prisma/client";
import { type TracksSliceType } from "./tracks";

export type NotificationsSliceData = {
  data: Notification[];
  notificationsData: TracksSliceType["data"];
};

const initialState: NotificationsSliceData = {
  data: [],
  notificationsData: { albums: [], authors: [], tracks: [] },
};

const notificationsSlice = createSlice({
  name: "notifications",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    setNotificationsData(
      state,
      { payload }: { payload: NotificationsSliceData },
    ) {
      state.data = payload.data;
      state.notificationsData = payload.notificationsData;
    },
  },
});

export const { setNotificationsData } = notificationsSlice.actions;

export default notificationsSlice.reducer;
