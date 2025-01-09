import { useQuery } from "@tanstack/react-query";
import { PlaylistDialog } from "./playlist-dialog";
import { type $Enums } from "@prisma/client";
import { getTracksByGenres } from "@/server/actions/track";

type MadeForYouSectionDialogContentProps = {
  activeDialog?: number;
  index: number;
  genre: $Enums.GENRES;
};

export function MadeForYouSectionDialogContent({
  index,
  activeDialog,
  genre,
}: MadeForYouSectionDialogContentProps) {
  const isActive = activeDialog === index;
  const { data: tracks } = useQuery({
    queryKey: [`home-made-for-you-section-${index}`],
    queryFn: async () => {
      const tracks = await getTracksByGenres({
        genres: [genre],
        range: { from: 0, to: 50 },
      });
      return tracks;
    },
    enabled: isActive,
  });
  return (
    <PlaylistDialog
      queueTypeId={`made-for-you-${index}`}
      isActive={isActive}
      isLoading={!tracks}
      data={tracks}
    />
  );
}
