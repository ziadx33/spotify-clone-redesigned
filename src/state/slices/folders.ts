import { type Folder } from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type SliceType } from "../types";
import { getFolders } from "@/server/queries/folder";

export type FoldersSliceType = SliceType<Folder[]>;

const initialState: FoldersSliceType = {
  status: "idle",
  data: null,
  error: null,
};

export const getSliceFolders = createAsyncThunk(
  "folders/getSliceFolders",
  async (userId: string) => {
    const folders = await getFolders(userId);
    return folders;
  },
);

const foldersSlice = createSlice({
  name: "folders",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as FoldersSliceType,
  reducers: {
    setFolders(state, { payload }: { payload: FoldersSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    removeFolder(state, { payload }: { payload: string }) {
      state.data =
        state.data?.filter((folder) => folder.id !== payload) ?? state.data;
    },
    addFolder(state, { payload }: { payload: Folder }) {
      state.data = state.data ? [payload, ...state.data] : state.data;
    },
    editFolder(
      state,
      { payload }: { payload: { id: string; data: Partial<Folder> } },
    ) {
      state.data =
        state.data?.map((folder) => {
          if (folder.id === payload.id)
            return {
              ...folder,
              ...payload.data,
            };
          return folder;
        }) ?? state.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSliceFolders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSliceFolders.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(getSliceFolders.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "";
      });
  },
});

export const { setFolders, addFolder, removeFolder, editFolder } =
  foldersSlice.actions;

export default foldersSlice.reducer;
