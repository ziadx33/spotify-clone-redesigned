import { SUPABASE_BUCKET_URL } from "@/constants";
import { createPlaylist, updatePlaylist } from "@/server/actions/playlist";
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

        await createTracks(
          newTracks?.map((track) => ({
            ...track,
            albumId: playlist.id,
            imgSrc: playlist.imageSrc,
          })) ?? [],
        );
        await deleteTracks(deletedTracks?.map((track) => track.id) ?? []);
        await updateTracks(editedTracks ?? []);
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
