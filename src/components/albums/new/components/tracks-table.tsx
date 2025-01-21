import { NonSortTable } from "@/components/components/non-sort-table";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import type { useNewAlbumActions } from "@/hooks/use-new-album-actions";
import type { TracksSliceType } from "@/state/slices/tracks";
import type { TempTrackType } from "..";
import type { MutableRefObject, Dispatch, SetStateAction } from "react";
import type { Track } from "@prisma/client";

type TracksTableProps = {
  tracks: TracksSliceType["data"];
  isLoading: boolean;
  deleteTrackHandler: ReturnType<
    typeof useNewAlbumActions
  >["deleteTrackHandler"];
  setTempTracksNum: Dispatch<SetStateAction<TempTrackType[]>>;
  tempTracksNum: TempTrackType[];
  playlistId: string | null;
  editedTrackIds: MutableRefObject<string[]>;
};

export function TracksTable({
  tracks,
  isLoading,
  deleteTrackHandler,
  setTempTracksNum,
  tempTracksNum,
  playlistId,
  editedTrackIds,
}: TracksTableProps) {
  const editHandler = (track: Track) => {
    setTempTracksNum((data) => [...data, { id: track.id, edit: true }]);
  };
  const removeHandler = (track: Track) => {
    void deleteTrackHandler(track, playlistId);
    setTempTracksNum((data) => data.filter((item) => item.id !== track.id));
    editedTrackIds.current = editedTrackIds.current.filter(
      (id) => id !== track.id,
    );
  };
  return (
    <Table>
      <NonSortTable
        viewAs="LIST"
        data={tracks}
        isLoading={isLoading}
        showNoTracksMessage={false}
        showTrackImage={false}
        hideTrackContext
        replaceDurationWithButton={(track) => {
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  removeHandler(track);
                }}
              >
                remove
              </Button>
              <Button
                variant="outline"
                disabled={!!tempTracksNum.find((item) => item.id === track.id)}
                onClick={() => editHandler(track)}
              >
                edit
              </Button>
            </div>
          );
        }}
      />
    </Table>
  );
}
