import {
  type Playlist,
  type User,
  type QueueList,
  type Queue,
} from "@prisma/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { type TracksSliceType } from "./tracks";
import { type SliceType } from "../types";
import { getUserQueue } from "@/server/queries/user";

export type QueueSliceType = {
  queueData?: Queue;
  dataTracks?: NonNullable<TracksSliceType["data"]>;
  artistTypeData?: User | null;
  playlistTypeData?: Playlist | null;
  defTrackList: string[];
};

export type QueueListSliceType = SliceType<{
  queueList: QueueList;
  queues: QueueSliceType[];
}>;

const initialState: QueueListSliceType = {
  status: "idle",
  data: null,
  error: null,
};

export const getSliceQueue = createAsyncThunk(
  "queue/getSliceQueue",
  async (userId: string) => {
    const queueData = await getUserQueue({ id: userId });
    return queueData;
  },
);

const queueListSlice = createSlice({
  name: "queue",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as QueueListSliceType,
  selectors: {
    getCurrentQueue(state) {
      return state.data?.queues.find(
        (queue) => queue.queueData?.id === state.data.queueList.currentQueueId,
      );
    },
  },
  reducers: {
    setQueue(state, { payload }: { payload: QueueListSliceType }) {
      state.status = payload.status;
      state.error = payload.error;
      state.data = payload.data;
    },
    editQueue(
      state,
      { payload }: { payload: Partial<QueueListSliceType["data"]> },
    ) {
      state.data = state.data ? { ...state.data, ...payload } : state.data;
    },
    editQueueById(
      state,
      {
        payload: { id, data },
      }: {
        payload: {
          data: Partial<Queue>;
          id: string;
        };
      },
    ) {
      if (state.data?.queues)
        state.data.queues =
          state.data.queues.map((queue) => {
            if (queue.queueData?.id === id) {
              return {
                ...queue,
                queueData: {
                  ...queue.queueData,
                  ...data,
                },
              };
            }
            return queue;
          }) ?? [];
    },
    editQueueDataById(
      state,
      {
        payload: { id, data },
      }: {
        payload: {
          data: Partial<QueueSliceType>;
          id?: string;
        };
      },
    ) {
      if (state.data?.queues)
        state.data.queues =
          state.data.queues.map((queue) => {
            if (queue.queueData?.id === id) {
              return {
                ...queue,
                ...data,
              };
            }
            return queue;
          }) ?? [];
    },
    editQueueList(state, { payload }: { payload: Partial<QueueList> }) {
      if (state.data?.queueList)
        state.data.queueList = state.data.queueList
          ? { ...state.data.queueList, ...payload }
          : state.data.queueList;
    },
    addQueue(state, { payload }: { payload: QueueSliceType }) {
      if (state.data?.queues)
        state.data.queues = [...state.data?.queues, payload];
    },
    removeQueue(state, { payload }: { payload: string }) {
      if (state.data?.queues)
        state.data.queues = state.data.queues.filter(
          (queue) => queue.queueData?.id !== payload,
        );
    },
    removeQueues(state, { payload }: { payload: string[] }) {
      if (state.data?.queues)
        state.data.queues = state.data.queues.filter(
          (queue) => !payload.includes(queue.queueData?.id ?? ""),
        );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSliceQueue.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSliceQueue.fulfilled, (state, { payload }) => {
        if (payload.status === "error") {
          state.status = "error";
          state.error = state.error ?? "";
          return;
        }
        state.data = payload?.data ?? null;
        state.status = "success";
      })
      .addCase(getSliceQueue.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message ?? "";
      });
  },
});

export const {
  setQueue,
  editQueue,
  editQueueById,
  editQueueList,
  addQueue,
  removeQueue,
  removeQueues,
  editQueueDataById,
} = queueListSlice.actions;

export const { getCurrentQueue } = queueListSlice.selectors;

export default queueListSlice.reducer;
