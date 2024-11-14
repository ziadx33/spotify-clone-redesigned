import { createSlice } from "@reduxjs/toolkit";

type NotFoundType = "PLAYLIST" | "ARTIST";

export type NotFoundSliceType = {
  type: NotFoundType | null;
};

const initialState: NotFoundSliceType = {
  type: "PLAYLIST",
};

const notFoundSlice = createSlice({
  name: "not-found",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    editNotFoundType(
      state,
      { payload }: { payload: NotFoundSliceType["type"] },
    ) {
      state.type = payload;
    },
  },
});

export const { editNotFoundType } = notFoundSlice.actions;

export default notFoundSlice.reducer;
