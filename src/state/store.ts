import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";

export const store = configureStore({
  reducer: {
    playlists,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
