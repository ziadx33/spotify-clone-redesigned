import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";
import tracks from "./slices/tracks";

export const store = configureStore({
  reducer: {
    playlists,
    tracks,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
