import { type RootState } from "@/state/store";
import { useSelector } from "react-redux";

type UseTracksProps = {
  albumId: string;
};

export function useTracks({ albumId }: UseTracksProps) {
  const { status, error, data } = useSelector((state: RootState) => {
    const data = state.tracks.data?.tracks?.filter((track) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      track.playlists?.includes(albumId),
    );
    console.log("yeaing rn", data);
    return {
      ...state.tracks,
      data: { ...state.tracks.data, tracks: data },
    };
  });
  return { status, error, data };
}
