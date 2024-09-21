import { type User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { SliceType } from "../types";

export type UsersSliceType = SliceType<User[]>;

const initialState: UsersSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const followingSlice = createSlice({
  name: "following",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as UsersSliceType,
  reducers: {
    setFollowing(state, { payload }: { payload: UsersSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    unFollowUser(state, { payload }: { payload: string }) {
      state.data =
        state.data?.filter((playlist) => playlist.id !== payload) ?? state.data;
    },
    followUser(state, { payload }: { payload: User }) {
      state.data = state.data ? [...state.data, payload] : state.data;
    },
  },
});

export const { setFollowing, followUser, unFollowUser } =
  followingSlice.actions;

export default followingSlice.reducer;
