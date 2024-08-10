import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";
import tracks from "./slices/tracks";
import tabs from "./slices/tabs";
import following from "./slices/following";

export const store = configureStore({
  reducer: {
    playlists,
    tracks,
    tabs,
    following,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
