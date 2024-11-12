import { type TracksSliceType } from "@/state/slices/tracks";
import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

export function useTracks() {
  const data = useSelector((state: RootState) => state.tracks);
  const getTrack = (data: TracksSliceType["data"], trackId: string) => {
    const track = data?.tracks?.find((track) => track.id === trackId);
    const album = data?.albums?.find((album) => album.id === track?.albumId);
    const author = data?.authors?.find(
      (author) => author.id === track?.authorId,
    );
    const authors = data?.authors?.filter(
      (author) =>
        author.id === track?.authorId || track?.authorIds.includes(author.id),
    );
    return {
      track,
      album,
      authors,
      author,
    };
  };
  return { data, getTrack };
}
