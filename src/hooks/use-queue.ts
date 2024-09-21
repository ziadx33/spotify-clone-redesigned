import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import {
  addToQueue,
  deleteQueue,
  deleteQueues,
  startQueue,
  updateQueue,
  updateQueueList,
  type addToQueueData,
} from "@/server/actions/queue";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "./use-session";
import { useCallback, useMemo } from "react";
import { type Queue, type QueueList, type $Enums } from "@prisma/client";
import { type ChangeValueParam } from "@/types";
import { getChangeValue } from "@/utils/get-change-value";
import { shuffleArray } from "@/utils/shuffle-array";
import {
  setQueue,
  editQueue,
  editQueueList,
  editQueueById,
  addQueue,
  removeQueue,
  removeQueues,
} from "@/state/slices/queue-list";
import { type TrackSliceType } from "@/state/slices/tracks";

export function useQueue() {
  const data = useSelector((state: RootState) => state.queueList);
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSession();

  const getQueue = useCallback(
    (queueId?: string) =>
      data.data?.queues.find((queue) => queue.queueData?.id === queueId),
    [data.data?.queues],
  );

  const currentQueue = useMemo(
    () => getQueue(data.data?.queueList.currentQueueId),
    [data.data?.queueList.currentQueueId, getQueue],
  );

  const getTrack = useCallback(
    (trackId: string, queueId?: string): TrackSliceType => {
      const queue = queueId ? getQueue(queueId) : currentQueue;
      const track = queue?.dataTracks?.tracks?.find((t) => t.id === trackId);
      const album = queue?.dataTracks?.albums?.find(
        (a) => a.id === track?.albumId,
      );
      const author = queue?.dataTracks?.authors?.find(
        (a) => a.id === track?.authorId,
      );
      const authors = queue?.dataTracks?.authors?.filter(
        (a) => !track?.authorIds.includes(a.id),
      );
      return { album, track, author, authors };
    },
    [currentQueue, getQueue],
  );

  const editQueueListFn = ({
    queueListData,
    editData,
  }: {
    queueListData: QueueList;
    editData: Partial<QueueList>;
  }) => {
    const updatedData = { ...queueListData, ...editData };
    const id = data.data?.queueList?.id ?? "";
    const runDispatch = () => dispatch(editQueueList(updatedData));
    const runServer = async () =>
      await updateQueueList({ data: updatedData, id });
    const runBoth = async () => {
      runDispatch();
      await runServer();
    };
    return { runDispatch, runServer, runBoth };
  };

  const editCurQueue = ({
    queueData,
    editData,
    queueId,
  }: {
    queueData: Queue;
    editData: Partial<Queue>;
    queueId?: string;
  }) => {
    const updatedData = { ...queueData, ...editData };
    const id = queueId ?? currentQueue?.queueData?.id ?? "";
    const runDispatch = () =>
      dispatch(editQueueById({ data: updatedData, id }));
    const runServer = async () => await updateQueue({ data: updatedData, id });
    const runBoth = async () => {
      runDispatch();
      await runServer();
    };
    return { runServer, runDispatch, runBoth };
  };

  const play = async (
    queueData: NonNullable<QueuePlayButtonProps["data"]>,
    queueListData?: Partial<QueueList>,
  ) => {
    if (data.error) {
      const startData = await startQueue({
        data: queueData.data,
        dataTracks: queueData.tracks!,
        userId: user?.user?.id ?? "",
        dataType: queueData.typePlaylist ?? queueData.typeArtist!,
        queueListData,
      });
      dispatch(setQueue(startData));
      return;
    }
    const currentQueueData: Queue = {
      currentPlayingProgress: 0,
      id: data.data!.queues[0]!.queueData!.id,
      ...queueData.data,
    };
    dispatch(
      editQueue({
        queues: [
          {
            defTrackList: queueData.data.trackList,
            artistTypeData: queueData.typeArtist,
            playlistTypeData: queueData.typePlaylist,
            queueData: currentQueueData,
            dataTracks: queueData.tracks,
          },
        ],
      }),
    );
    await updateQueue({
      data: currentQueueData,
      id: currentQueueData.id,
    });
  };

  const shuffleQueue = async ({
    value,
  }: {
    value: ChangeValueParam<boolean>;
  }) => {
    const queueList = data.data!.queueList;
    const queueData = currentQueue!.queueData!;
    const shuffleValue = getChangeValue(value, queueList.randomize);
    let trackList = queueData.trackList;

    if (shuffleValue) {
      const currentPlayingIndex = trackList.indexOf(queueData.currentPlaying);
      const validIndex = currentPlayingIndex >= 0 ? currentPlayingIndex : 0;
      const nextTracks = trackList.slice(validIndex + 1);
      trackList = [
        ...trackList.slice(0, validIndex),
        queueData.currentPlaying,
        ...shuffleArray(nextTracks),
      ];
      console.log("saf", trackList);
    } else {
      trackList = currentQueue?.defTrackList ?? [];
    }

    const { runDispatch: runListDispatch, runServer: runListServer } =
      editQueueListFn({
        queueListData: queueList,
        editData: { randomize: shuffleValue },
      });

    const { runDispatch: runQueueDispatch, runServer: runQueueServer } =
      editCurQueue({ editData: { trackList }, queueData });

    runListDispatch();
    runQueueDispatch();
    await runListServer();
    await runQueueServer();
  };

  const repeatQueue = async ({
    value,
  }: {
    value: ChangeValueParam<$Enums.REPEAT_QUEUE_TYPE | null>;
  }) => {
    const repeatValue = getChangeValue(value, data.data?.queueList.repeatQueue);
    const { runBoth } = editQueueListFn({
      queueListData: data.data!.queueList,
      editData: { repeatQueue: repeatValue },
    });
    await runBoth();
  };

  const removeQueueFromList = (id: string) => {
    // if (id !== currentQueue?.queueData?.id) {
    //   if (data?.data?.queues.length ===  1) {

    //   }
    // }
    const runDispatch = () => dispatch(removeQueue(id));

    const runServer = async () => await deleteQueue({ queueId: id });
    const runBoth = async () => {
      runDispatch();
      await runServer();
    };
    return { runBoth, runServer, runDispatch };
  };

  const removeQueuesFromList = (ids: string[]) => {
    const runDispatch = () => dispatch(removeQueues(ids));

    const runServer = async () => await deleteQueues({ queueIds: ids });
    const runBoth = async () => {
      runDispatch();
      await runServer();
    };
    return { runBoth, runServer, runDispatch };
  };

  const skipBy = async (id: string | number, queueId?: string) => {
    const queueData = !queueId
      ? currentQueue!.queueData!
      : getQueue(queueId)!.queueData!;
    const queueList = data.data!.queueList;
    let targetTrack: string;

    if (typeof id === "number") {
      const curIndex = queueData.trackList.indexOf(queueData.currentPlaying);
      const targetIndex = Math.min(
        curIndex + id,
        queueData.trackList.length - 1,
      );
      targetTrack = queueData.trackList[targetIndex]!;
    } else {
      targetTrack = id;
    }

    const {
      runBoth,
      runDispatch: runQueueDispatch,
      runServer: runQueueServer,
    } = editCurQueue({
      queueData,
      editData: {
        currentPlaying: targetTrack,
      },
      queueId,
    });

    if (queueId && queueId !== currentQueue?.queueData?.id) {
      const { runServer: runListServer, runDispatch: runListDispatch } =
        editQueueListFn({
          queueListData: queueList,
          editData: { currentQueueId: queueId },
        });

      const indexOfQueue = data.data?.queues
        .map((queue) => queue.queueData?.id)
        .indexOf(queueId);

      const deleteQueues =
        data.data?.queues
          .slice(0, indexOfQueue)
          .map((queue) => queue.queueData?.id ?? "") ?? [];

      const { runDispatch: runDeleteQueue, runServer: runDeleteServer } =
        removeQueuesFromList(deleteQueues);

      runListDispatch();
      runQueueDispatch();
      runDeleteQueue();
      await runListServer();
      await runQueueServer();
      await runDeleteServer();
      return;
    }

    await runBoth();
  };

  const addPlaylistToQueue = async (
    params: addToQueueData & { queueList?: QueueList | null },
  ) => {
    if (data.error) return;
    if (params.queueList) {
      const data = await addToQueue({
        ...params,
        queueList: params.queueList,
      });
      dispatch(addQueue(data));
    }
  };

  return {
    data,
    play,
    getTrack,
    shuffleQueue,
    repeatQueue,
    skipBy,
    currentQueue,
    addPlaylistToQueue,
    removeQueueFromList,
  };
}
