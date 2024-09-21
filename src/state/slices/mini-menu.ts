import { createSlice } from "@reduxjs/toolkit";

export type MiniMenuType = {
  value: boolean;
  showQueue: boolean;
};

const initialState: MiniMenuType = {
  value: false,
  showQueue: false,
};

const miniMenuSlice = createSlice({
  name: "mini-menu",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    showMenu(state, { payload }: { payload: MiniMenuType }) {
      state.value = payload.value;
      state.showQueue = payload.showQueue;
    },
  },
});

export const { showMenu } = miniMenuSlice.actions;

export default miniMenuSlice.reducer;
