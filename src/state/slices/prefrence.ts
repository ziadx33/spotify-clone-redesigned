import { type Preference } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

export type PrefrenceSliceType =
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: Preference; error: null }
  | { status: "error"; data: null; error: string };

const initialState: PrefrenceSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const prefrenceSlice = createSlice({
  name: "prefrence",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as PrefrenceSliceType,
  reducers: {
    setPrefrence(state, { payload }: { payload: PrefrenceSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    editPrefrence(state, { payload }: { payload: Partial<Preference> }) {
      state.data = state.data
        ? { ...state.data, ...payload }
        : {
            hiddenHomeSections: [],
            homeSectionsSort: [],
            id: "",
            pinnedHomeSections: [],
            userId: "",
            ...payload,
          };
      state.status = "success";
    },
  },
});

export const { setPrefrence, editPrefrence } = prefrenceSlice.actions;

export default prefrenceSlice.reducer;