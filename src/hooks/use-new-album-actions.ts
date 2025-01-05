import { SUPABASE_BUCKET_URL } from "@/constants";
import { createPlaylist } from "@/server/actions/playlist";
import { createTracks } from "@/server/actions/track";
import { uploadPlaylistPic } from "@/server/actions/upload";
import { deleteAudioFile } from "@/server/actions/uploadthing";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Track, type Playlist } from "@prisma/client";
import { useRouter } from "next/navigation";
import { type Dispatch, type SetStateAction, useTransition } from "react";
import { toast } from "sonner";

type useCreateAlbumParams = {
  data: Omit<Playlist, "id">;
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
      console.log("deep", data);
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
  const deleteTrackHandler = (track: Track) => {
    void deleteAudioFile(track.id);
    setTracks((prev) => {
      if (!prev?.tracks) return prev;
      return {
        ...prev,
        tracks: prev.tracks.filter((t) => t.id !== track.id),
      };
    });
  };
  return { submitTransition, submitHandler, deleteTrackHandler };
}
