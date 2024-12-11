import { configureStore } from "@reduxjs/toolkit";
import playlists from "./slices/playlists";
import tracks from "./slices/tracks";
import tabs from "./slices/tabs";
import following from "./slices/following";
import prefrence from "./slices/prefrence";
import queueList from "./slices/queue-list";
import miniMenu from "./slices/mini-menu";
import queueController from "./slices/queue-controller";
import explore from "./slices/explore";
import notFound from "./slices/not-found";
import notifications from "./slices/notifications";
import user from "./slices/user";

export const store = configureStore({
  reducer: {
    user,
    playlists,
    tracks,
    tabs,
    following,
    prefrence,
    queueList,
    miniMenu,
    queueController,
    explore,
    notFound,
    notifications,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
