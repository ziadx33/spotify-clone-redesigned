import { type Tab } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type TabsSliceType =
  | { status: "loading"; data: null; error: null }
  | {
      status: "success";
      data: Tab[];
      error: null;
    }
  | { status: "error"; data: null; error: string };

const initialState: TabsSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const tracksSlice = createSlice({
  name: "tracks",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as TabsSliceType,
  reducers: {
    setTabs(state, { payload }: { payload: TabsSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },

    addTab(
      state,
      {
        payload,
      }: {
        payload: Tab;
      },
    ) {
      if (state.data) state.data = [...state.data, payload];
    },
    updateTab(
      state,
      {
        payload: { updateData, id },
      }: {
        payload: { updateData: Partial<Tab>; id: string };
      },
    ) {
      if (state.data)
        state.data = state.data.map((tab) => {
          if (tab.id === id) return { ...tab, ...updateData };
          return tab;
        });
    },
    removeTab(state, { payload }: { payload: string }) {
      if (state.data)
        state.data = state.data.filter((tab) => tab.id !== payload);
    },
  },
});

export const { addTab, setTabs, updateTab, removeTab } = tracksSlice.actions;

export default tracksSlice.reducer;
