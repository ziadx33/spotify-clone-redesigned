import { createSlice } from "@reduxjs/toolkit";
import { type TracksSliceType } from "./tracks";

export type ExploreSliceData = {
  data: NonNullable<TracksSliceType["data"]> & {
    randomly: boolean;
  };
};

const initialState: ExploreSliceData = {
  data: {
    tracks: [],
    authors: [],
    albums: [],
    randomly: true,
  },
};

const exploreSlice = createSlice({
  name: "explore",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    setExploreData(state, { payload }: { payload: ExploreSliceData }) {
      state.data = payload.data;
    },
    editExploreData(
      state,
      { payload }: { payload: Partial<ExploreSliceData["data"]> },
    ) {
      state.data = {
        ...state.data,
        ...payload,
      };
    },
  },
});

export const { setExploreData, editExploreData } = exploreSlice.actions;

export default exploreSlice.reducer;
