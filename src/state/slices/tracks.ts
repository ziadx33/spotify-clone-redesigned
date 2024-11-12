import { type User, type Track, type Playlist } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { type SliceType } from "../types";

export type TrackSliceType = {
  track?: Track | null;
  author?: User | null;
  album?: Playlist | null;
  authors?: User[] | null;
};

export type TracksSliceType = SliceType<{
  tracks: Track[] | null;
  authors: User[] | null;
  albums: Playlist[] | null;
}>;

const initialState: TracksSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const tracksSlice = createSlice({
  name: "tracks",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as TracksSliceType,
  reducers: {
    setTracks(state, { payload }: { payload: TracksSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    removeTrackFromPlaylist(
      state,
      { payload }: { payload: { trackId: string; playlistId: string } },
    ) {
      if (state.data?.tracks)
        state.data = {
          ...state.data,
          tracks: state.data?.tracks?.filter(
            (track) => track.id !== payload.trackId,
          ),
        };
    },
    addTrackToPlaylist(
      state,
      { payload }: { payload: { trackId: string; playlistId: string } },
    ) {
      if (state.data?.tracks)
        state.data.tracks = state.data?.tracks?.map((track) => {
          if (track.id === payload.trackId)
            return {
              ...track,
              playlists: [...track.playlists, payload.playlistId],
            };
          return track;
        });
    },

    addTracks(state, { payload }: { payload: TracksSliceType["data"] }) {
      if (state.data) {
        state.data.tracks = [
          ...(state.data.tracks ?? []),
          ...(payload?.tracks ?? []),
        ];
        state.data.albums = [
          ...(state.data.albums ?? []),
          ...(payload?.albums ?? []),
        ];
        state.data.authors = [
          ...(state.data.authors ?? []),
          ...(payload?.authors ?? []),
        ];
      }
    },

    addTrack(
      state,
      {
        payload: { trackData, playlists, artists },
      }: {
        payload: { trackData: Track; artists: User[]; playlists: Playlist[] };
      },
    ) {
      if (state.data?.tracks)
        state.data = {
          ...state.data,
          tracks: [...state.data.tracks, trackData],
          albums: [...(state.data.albums ?? []), ...playlists],
          authors: [
            ...(state.data.authors ?? []),
            ...artists.filter(
              (artist) =>
                !state.data.authors
                  ?.map((author) => author.id)
                  .includes(artist.id),
            ),
          ],
        };
    },
  },
});

/*
  selectors: {
    getCurrentQueue(state) {
      return state.data?.queues.find(
        (queue) => queue.queueData?.id === state.data.queueList.currentQueueId,
      );
    },
  },
*/

export const {
  setTracks,
  removeTrackFromPlaylist,
  addTrackToPlaylist,
  addTrack,
  addTracks,
} = tracksSlice.actions;

export default tracksSlice.reducer;
