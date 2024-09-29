import { type $Enums } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type QueueControllerSliceType = {
  data: {
    isPlaying: boolean;
    progress: number;
    volume: number;
    audioData?: {
      track: {
        id: string;
        order: number;
        title: string;
        authorId: string;
        authorIds: string[];
        imgSrc: string;
        trackSrc: string;
        albumId: string;
        playlists: string[];
        dateAdded: Date;
        duration: number;
        plays: number;
        genres: $Enums.GENRES[];
      };
    }[];
    currentTrackId: string | undefined;
  };
};

const initialState: QueueControllerSliceType = {
  data: {
    isPlaying: false,
    progress: 0,
    volume: 50,
    currentTrackId: undefined,
  },
};

const queueControllerSlice = createSlice({
  name: "queue-controller",
  initialState: initialState,
  reducers: {
    editQueueController(
      state,
      { payload }: { payload: Partial<QueueControllerSliceType["data"]> },
    ) {
      state.data = state.data ? { ...state.data, ...payload } : state.data;
    },
  },
});

export const { editQueueController } = queueControllerSlice.actions;

export default queueControllerSlice.reducer;
