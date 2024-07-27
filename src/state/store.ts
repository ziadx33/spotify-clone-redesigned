import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";
import tracks from "./slices/tracks";
import tabs from "./slices/tabs";

export const store = configureStore({
  reducer: {
    playlists,
    tracks,
    tabs,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
