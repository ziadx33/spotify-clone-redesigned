import { type Request } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type SliceType } from "../types";
import { getFeatRequests } from "@/server/actions/request";

export type RequestsSliceType = SliceType<Request[]>;

const initialState: RequestsSliceType = {
  status: "idle",
  data: null,
  error: null,
};

export const getSliceRequests = createAsyncThunk(
  "requests/getSliceRequests",
  async (userId: string) => {
    const requests = await getFeatRequests({ userId });
    return requests;
  },
);

const requestsSlice = createSlice({
  name: "requests",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as RequestsSliceType,
  reducers: {
    setRequests(state, { payload }: { payload: RequestsSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    removeRequest(state, { payload }: { payload: string }) {
      state.data =
        state.data?.filter((folder) => folder.id !== payload) ?? state.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSliceRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSliceRequests.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(getSliceRequests.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "";
      });
  },
});

export const { removeRequest, setRequests } = requestsSlice.actions;

export default requestsSlice.reducer;
