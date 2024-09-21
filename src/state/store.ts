import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";
import tracks from "./slices/tracks";
import tabs from "./slices/tabs";
import following from "./slices/following";
import prefrence from "./slices/prefrence";
import queueList from "./slices/queue-list";
import miniMenu from "./slices/mini-menu";

export const store = configureStore({
  reducer: {
    playlists,
    tracks,
    tabs,
    following,
    prefrence,
    queueList,
    miniMenu,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
