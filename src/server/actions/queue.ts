"use server";

import { db } from "../db";
import {
  type QueueSliceType,
  type QueueListSliceType,
} from "@/state/slices/queue-list";
import {
  type User,
  type Queue,
  type QueueList,
  type Playlist,
} from "@prisma/client";
import { revalidateTag } from "next/cache";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Nullable } from "@/types";
import { shuffleArray } from "@/utils/shuffle-array";
import { getArtistTracks } from "../queries/user";
import { getPlaylistTracks } from "../queries/playlist";

type StartQueueParams = {
  data: Parameters<typeof db.queue.create>["0"]["data"];
  userId: string;
  dataTracks: TracksSliceType["data"];
  dataType: Playlist | User;
  queueListData?: Partial<QueueList>;
};

export const startQueue = async ({
  data,
  userId,
  dataTracks,
  dataType,
  queueListData,
}: StartQueueParams): Promise<QueueListSliceType> => {
  try {
    const queue = await db.queue.create({
      data,
    });
    const queueList = await db.queueList.create({
      data: {
        ...queueListData,
        currentQueueId: queue.id,
        queues: {
          connect: {
            id: queue.id,
          },
        },
        userId,
      },
    });
    return {
      data: {
        queueList,
        queues: [
          {
            queueData: queue,
            dataTracks: {
              albums: dataTracks?.albums ?? [],
              authors: dataTracks?.authors ?? [],
              tracks: dataTracks?.tracks ?? [],
            },
            defTrackList: (data.trackList ?? []) as string[],
            artistTypeData: dataType.type === "ARTIST" ? dataType : undefined,
            playlistTypeData: dataType.type === "ALBUM" ? dataType : undefined,
          },
        ],
      },
      status: "success",
      error: null,
    };
  } catch (error) {
    throw { error };
  }
};

type UpdateQueueListParams = {
  data: Parameters<typeof db.queueList.create>["0"]["data"];
  id: string;
  userId: string;
};

export const updateQueueList = async ({
  data,
  id,
  userId,
}: UpdateQueueListParams) => {
  try {
    const updatedQueueList = await db.queueList.update({
      data,
      where: {
        id,
      },
    });
    revalidateTag(`user-queue-${userId}`);
    return updatedQueueList;
  } catch (error) {
    throw { error };
  }
};

type UpdateQueueParams = {
  data: Parameters<typeof db.queue.create>["0"]["data"];
  id: string;
  userId: string;
};

export const updateQueue = async ({ data, id, userId }: UpdateQueueParams) => {
  try {
    const updatedQueueList = await db.queue.update({
      data,
      where: {
        id,
      },
    });
    revalidateTag(`user-queue-${userId}`);
    return updatedQueueList;
  } catch (error) {
    throw { error };
  }
};

type CreateQueueProps = {
  data: Parameters<typeof db.queue.create>["0"]["data"];
};

export async function createQueue({ data }: CreateQueueProps) {
  try {
    const createdQueue = await db.queue.create({ data });
    return createdQueue;
  } catch (error) {
    throw { error };
  }
}

export type addToQueueData =
  | { data: Playlist; type: "PLAYLIST" }
  | { data: User; type: "ARTIST" };

export type addToQueueParams = addToQueueData & { queueList: QueueList };

export async function addToQueue(
  params: addToQueueParams,
): Promise<QueueSliceType> {
  try {
    let dataTracks: Nullable<QueueSliceType["dataTracks"]>;
    let createdQueue: Queue;
    if (params.type === "PLAYLIST") {
      const { data } = await getPlaylistTracks({ playlistId: params.data.id });
      const trackList = data?.tracks?.map((track) => track.id) ?? [];
      createdQueue = await createQueue({
        data: {
          trackList: trackList,
          currentPlaying: trackList?.[0] ?? "",
          type: "PLAYLIST",
          typeId: params.data.id,
          QueueList: {
            connect: params.queueList,
          },
        },
      });

      dataTracks = data!;
    } else {
      const data = await getArtistTracks(params.data.id);
      const trackList = data?.tracks?.map((track) => track.id) ?? [];
      const shuffledTrackList = params.queueList.randomize
        ? shuffleArray(trackList)
        : trackList;
      createdQueue = await createQueue({
        data: {
          trackList: shuffledTrackList,
          currentPlaying: shuffledTrackList?.[0] ?? "",
          type: "ARTIST",
          typeId: params.data.id,
          QueueList: {
            connect: params.queueList,
          },
        },
      });

      dataTracks = {
        albums: data?.data.playlists,
        authors: data?.data.authors,
        tracks: data?.tracks,
      };
    }

    return {
      queueData: createdQueue,
      dataTracks: {
        albums: dataTracks?.albums ?? [],
        authors: dataTracks?.authors ?? [],
        tracks: dataTracks?.tracks ?? [],
      },
      defTrackList: createdQueue.trackList,
      playlistTypeData: params.type === "PLAYLIST" ? params.data : undefined,
      artistTypeData: params.type === "ARTIST" ? params.data : undefined,
    };
  } catch (error) {
    throw { error };
  }
}

export async function deleteQueue({ queueId }: { queueId: string }) {
  try {
    const deletedQueue = await db.queue.delete({
      where: {
        id: queueId,
      },
    });
    return deletedQueue;
  } catch (error) {
    throw { error };
  }
}

export async function deleteQueues({ queueIds }: { queueIds: string[] }) {
  try {
    const deletedQueues = await db.queue.deleteMany({
      where: {
        id: {
          in: queueIds,
        },
      },
    });
    return deletedQueues;
  } catch (error) {
    throw { error };
  }
}
