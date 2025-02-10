import { SUPABASE_BUCKET_URL } from "@/constants";
import { createPlaylist, updatePlaylist } from "@/server/actions/playlist";
import { sendFeatRequests } from "@/server/actions/request";
import {
  createTracks,
  deleteTracks,
  removeTrackFromPlaylistDB,
  updateTracks,
} from "@/server/actions/track";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { deleteAudioFile } from "@/server/actions/uploadthing";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Track, type Playlist } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useTransition } from "react";
import { toast } from "sonner";
import { useUserData } from "./use-user-data";

type useCreateAlbumParams = {
  data: Playlist;
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
  albumImage: File | null;
};

export function useNewAlbumActions({
  data,
  tracks,
  albumImage,
  setTracks,
}: useCreateAlbumParams) {
  const [submitTransition, startSubmitTransition] = useTransition();
  const router = useRouter();
  const userData = useUserData();
  const submitHandler = () => {
    startSubmitTransition(async () => {
      if (tracks?.tracks?.length === 0) {
        toast.error("Add at least one track");
        return;
      }
      if (!data.genres?.length) {
        toast.error("Add at least one genre");
        return;
      }
      const playlistId = crypto.randomUUID();
      const playlistData: Omit<Playlist, "id"> = {
        ...data,
        type: tracks?.tracks?.length === 1 ? "SINGLE" : "ALBUM",
      };
      let playlist;
      if (albumImage) {
        const playlistPicData = await uploadPlaylistPic({
          file: albumImage,
          id: playlistId,
        });
        playlist = await createPlaylist({
          ...playlistData,
          imageSrc: `${SUPABASE_BUCKET_URL}/images/${playlistPicData}?${performance.now()}`,
        });
      } else playlist = await createPlaylist(playlistData);
      if (tracks?.tracks) {
        await sendFeatRequests(
          tracks.tracks.map((track) => ({
            requesterId: userData.id,
            requestedUserIds: track.authorIds,
            trackId: track.id,
            type: "FEAT",
          })),
        );
        await createTracks(
          tracks.tracks.map((track) => ({
            ...track,
            albumId: playlist.id,
            imgSrc: playlist.imageSrc,
            authorIds: [track.authorId],
          })),
        );
      }
      router.push(`/playlist/${playlist.id}`);
    });
  };
  const editHandler = (
    oldData: {
      playlist: Playlist | null;
      tracks: TracksSliceType["data"];
    },
    editedTrackIds: string[],
  ) => {
    startSubmitTransition(async () => {
      if (tracks?.tracks?.length === 0) {
        toast.error("Add at least one track");
        return;
      }
      if (!data.genres?.length) {
        toast.error("Add at least one genre");
        return;
      }
      const playlistData: Omit<Playlist, "id"> = {
        ...data,
        type: tracks?.tracks?.length === 1 ? "SINGLE" : "ALBUM",
      };
      let playlist;
      const albumImageSrc = `${SUPABASE_BUCKET_URL}/images/${data.id}?${performance.now()}`;
      if (
        albumImageSrc.split("?")[0] !==
          oldData.playlist?.imageSrc.split("?")[0] &&
        albumImage
      ) {
        await uploadPlaylistPic({
          file: albumImage,
          id: data.id,
        });
        playlist = await updatePlaylist({
          id: data.id,
          data: {
            ...playlistData,
            imageSrc: albumImageSrc,
          },
        });
      } else
        playlist = await updatePlaylist({ id: data.id, data: playlistData });
      if (oldData) {
        const newTracks = tracks?.tracks?.filter(
          (track) =>
            !oldData.tracks?.tracks?.find((trck) => trck.id === track.id),
        );
        const deletedTracks = oldData.tracks?.tracks?.filter(
          (track) => !tracks?.tracks?.find((trck) => trck.id === track.id),
        );
        const editedTracks = tracks?.tracks?.filter((track) =>
          editedTrackIds.includes(track.id),
        );

        let featRequests: Parameters<typeof sendFeatRequests>["0"] = [];

        if ((newTracks?.length ?? 0) > 0) {
          featRequests = [
            ...featRequests,
            ...(newTracks?.map((track) => ({
              requesterId: userData.id,
              requestedUserIds: track.authorIds,
              trackId: track.id,
              type: "FEAT" as const,
            })) ?? []),
          ];
        }

        const updatedTracks = editedTracks?.map((editedTrack) => {
          const oldTrack = (oldData.tracks?.tracks ?? []).find(
            (oldTrack) => oldTrack.id === editedTrack.id,
          );
          if (!oldTrack) return editedTrack;

          const oldAuthorIds = new Set(oldTrack.authorIds);
          const newAuthorIds = editedTrack.authorIds.filter(
            (id) => !oldAuthorIds.has(id),
          );

          return { ...editedTrack, authorIds: newAuthorIds };
        });

        console.log(updatedTracks);

        if (updatedTracks?.length ?? 0 > 0) {
          featRequests = [
            ...featRequests,
            ...(updatedTracks?.map((track) => ({
              requesterId: userData.id,
              requestedUserIds: track.authorIds,
              trackId: track.id,
              type: "FEAT" as const,
            })) ?? []),
          ];
        }

        if (featRequests.length > 0) {
          await sendFeatRequests(featRequests);
        }

        await createTracks(
          newTracks?.map((track) => ({
            ...track,
            albumId: playlist.id,
            imgSrc: playlist.imageSrc,
            authorIds: [track.authorId],
          })) ?? [],
        );
        await deleteTracks(deletedTracks?.map((track) => track.id) ?? []);
        await updateTracks(
          (editedTracks ?? []).map((track) => ({
            ...track,
            authorIds: [track.authorId],
          })),
        );
      } else if (tracks?.tracks) {
        await createTracks(
          tracks.tracks.map((track) => ({
            ...track,
            albumId: playlist.id,
            imgSrc: playlist.imageSrc,
          })),
        );
      }
      router.push(`/playlist/${playlist.id}`);
    });
  };
  const deleteTrackHandler = async (
    track: Track,
    playlistId: string | null,
  ) => {
    void deleteAudioFile(track.id);
    setTracks((prev) => {
      if (!prev?.tracks) return prev;
      return {
        ...prev,
        tracks: prev.tracks.filter((t) => t.id !== track.id),
      };
    });
    if (playlistId) {
      await removeTrackFromPlaylistDB({
        playlistId,
        trackId: track.id,
        playlists: track.playlists,
      });
    }
  };
  return { submitTransition, submitHandler, deleteTrackHandler, editHandler };
}
