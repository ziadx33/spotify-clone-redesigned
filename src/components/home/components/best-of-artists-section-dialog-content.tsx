import { useQuery } from "@tanstack/react-query";
import { PlaylistDialog } from "./playlist-dialog";
import { getTracksByArtistId } from "@/server/actions/track";

type BestOfArtistsSectionDialogContentProps = {
  activeDialog?: number | null;
  index: number;
  artistId: string;
};

export function BestOfArtistsSectionDialogContent({
  index,
  activeDialog,
  artistId,
}: BestOfArtistsSectionDialogContentProps) {
  const isActive = activeDialog === index;
  const { data: tracks } = useQuery({
    queryKey: [`best-of-artists-section-${index}`],
    queryFn: async () => {
      const data = await getTracksByArtistId(artistId, 50);
      return {
        tracks: data.tracks,
        authors: data.data.authors ?? [],
        albums: data.data.playlists ?? [],
      };
    },
    enabled: isActive,
  });
  return (
    <PlaylistDialog
      queueTypeId={`best-of-artists-${index}`}
      isActive={isActive}
      isLoading={!!tracks}
      data={tracks}
    />
  );
}
