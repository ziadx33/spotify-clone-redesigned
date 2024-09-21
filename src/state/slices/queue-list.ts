import {
  type Playlist,
  type User,
  type QueueList,
  type Queue,
} from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import { type TracksSliceType } from "./tracks";
import { type SliceType } from "../types";

export type QueueSliceType = {
  queueData?: Queue;
  dataTracks?: NonNullable<TracksSliceType["data"]>;
  artistTypeData?: User;
  playlistTypeData?: Playlist;
  defTrackList: string[];
};

export type QueueListSliceType = SliceType<{
  queueList: QueueList;
  queues: QueueSliceType[];
}>;

const initialState: QueueListSliceType = {
  status: "loading",
  data: null,
  error: null,
};

const queueListSlice = createSlice({
  name: "queue",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  initialState: initialState as QueueListSliceType,
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
              console.log("mesh mabsoot");
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
});

export const {
  setQueue,
  editQueue,
  editQueueById,
  editQueueList,
  addQueue,
  removeQueue,
  removeQueues,
} = queueListSlice.actions;

export default queueListSlice.reducer;
