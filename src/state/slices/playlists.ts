import { type Playlist } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type PlaylistsSliceType =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: Playlist[]; error: null }
  | { status: "error"; data: null; error: string };

const initialState: PlaylistsSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const playlistsSlice = createSlice({
  name: "playlists",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as PlaylistsSliceType,
  reducers: {
    setPlaylists(state, { payload }: { payload: PlaylistsSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
  },
});

export const { setPlaylists } = playlistsSlice.actions;

export default playlistsSlice.reducer;
