import { createSlice } from "@reduxjs/toolkit";

export type MiniMenuType = {
  value: boolean;
  showQueue: boolean;
  showFullMenu: boolean;
};

const initialState: MiniMenuType = {
  value: false,
  showQueue: false,
  showFullMenu: false,
};

const miniMenuSlice = createSlice({
  name: "mini-menu",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    showMenu(state, { payload }: { payload: Partial<MiniMenuType> }) {
      if (payload.value !== undefined) state.value = payload.value;
      if (payload.showQueue !== undefined) state.showQueue = payload.showQueue;
      if (payload.showFullMenu !== undefined)
        state.showFullMenu = payload.showFullMenu;
    },
  },
});

export const { showMenu } = miniMenuSlice.actions;

export default miniMenuSlice.reducer;
