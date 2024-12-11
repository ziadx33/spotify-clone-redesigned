import { createSlice } from "@reduxjs/toolkit";
import { type User } from "@prisma/client";

export type UserDataSlice = {
  data: User;
};

const initialState: UserDataSlice = {
  data: {} as User,
};

const userSlice = createSlice({
  name: "user",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState,
  reducers: {
    setUserData(state, { payload }: { payload: UserDataSlice }) {
      state.data = payload.data;
    },
    editUserData(
      state,
      { payload }: { payload: Partial<UserDataSlice["data"]> },
    ) {
      state.data = {
        ...state.data,
        ...payload,
      };
    },
  },
});

export const { setUserData, editUserData } = userSlice.actions;

export default userSlice.reducer;
