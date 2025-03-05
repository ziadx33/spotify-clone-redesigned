import { type QueueListSliceType } from "@/state/slices/queue-list";
import { type User, type Queue, type QueueList } from "@prisma/client";
import { getPlaylists } from "./playlist";
import { getUserByIds } from "./user";
import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { type TracksSliceType } from "@/state/slices/tracks";
import { getTracks } from "./track";

type GetQueueDataParams = {
  queues: Queue[];
  queueList: QueueList;
};

export const getQueueData = async ({
  queues,
  queueList,
}: GetQueueDataParams): Promise<QueueListSliceType> => {
  const queueTracks = await getTracks({
    ids: queues?.map((queue) => queue.trackList).flat(),
  });
  const queuesData = await getQueueTracks({ queues, data: queueTracks });

  return !queueTracks.error
    ? {
        data: {
          queueList,
          queues: queuesData,
        },
        error: null,
        status: "success",
      }
    : {
        data: null,
        error: queueTracks.error,
        status: "error",
      };
};

type GetTrackSliceParams = {
  queues: Queue[];
  data: TracksSliceType["data"];
  typePlaylists?: PlaylistsSliceType;
  typeArtists?: User[];
};

export async function getQueueTracks({ queues, data }: GetTrackSliceParams) {
  const queuePlaylistTypeData = await getPlaylists({
    playlistIds: queues
      ?.filter((queue) => queue.type === "PLAYLIST" && queue.typeId !== null)
      .map((queue) => queue.typeId!),
  });
  const userIds = queues
    ?.filter((queue) => queue.type === "ARTIST" && queue.typeId !== null)
    .map((queue) => queue.typeId!);
  const queueArtistTypeData =
    userIds.length > 0 ? await getUserByIds({ ids: userIds ?? [] }) : [];
  return queues?.map((queue) => {
    const tracks =
      data?.tracks?.filter((track) => {
        return queue.trackList.includes(track.id);
      }) ?? null;
    const authors =
      data?.authors?.filter((author) => {
        return tracks
          ?.map((track) => [track.authorId, ...track.authorIds])
          .flat()
          .includes(author.id);
      }) ?? null;
    const albums =
      data?.albums?.filter((album) => {
        return tracks
          ?.map((track) => track.albumId)
          .flat()
          .includes(album.id);
      }) ?? null;
    const artistTypeData = queueArtistTypeData!.find(
      (artist) => artist.id === queue.typeId,
    )!;
    const playlistTypeData = queuePlaylistTypeData?.data?.find(
      (playlist) => playlist.id === queue.typeId,
    );
    return {
      queueData: queue,
      dataTracks: {
        tracks,
        albums,
        authors,
      },
      defTrackList: queue.trackList,
      artistTypeData,
      playlistTypeData,
    };
  });
}
