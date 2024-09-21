import { type ChangeCurrentTabPrams } from "@/server/actions/tab";
import { type Tab } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { SliceType } from "../types";

export type TabsSliceType = SliceType<Tab[]>;

const initialState: TabsSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const tracksSlice = createSlice({
  name: "tabs",
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
    changeCurrentTab(state, { payload }: { payload: ChangeCurrentTabPrams }) {
      if (state.data) {
        state.data = state.data.map((tab) => {
          if (tab.id === payload.id)
            return {
              ...tab,
              current: payload.currentBoolean ?? true,
            };
          return {
            ...tab,
            current: false,
          };
        });
      }
    },
  },
});

export const { addTab, setTabs, updateTab, removeTab, changeCurrentTab } =
  tracksSlice.actions;

export default tracksSlice.reducer;
