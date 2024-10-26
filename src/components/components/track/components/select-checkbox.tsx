import { TableCell } from "@/components/ui/table";
import { type Track } from "@prisma/client";
import { type TrackProps } from "../types";
import { Checkbox } from "@/components/ui/checkbox";

type TrackSelectCheckboxProps = {
  skeleton: boolean;
  showButtons: boolean;
  selected?: boolean;
  track?: Track;
  setSelectedTracks?: TrackProps["setSelectedTracks"];
};

export function SelectCheckbox({
  skeleton,
  showButtons,
  selected,
  setSelectedTracks,
  track,
}: TrackSelectCheckboxProps) {
  return (
    <TableCell>
      {setSelectedTracks && !skeleton && (showButtons || selected) && (
        <Checkbox
          onCheckedChange={(e) =>
            setSelectedTracks((v) =>
              e
                ? [...v, track!.id]
                : v.filter((trk) => trk !== track!.id) ?? [],
            )
          }
          defaultChecked={selected}
          className="rounded-full"
        />
      )}
    </TableCell>
  );
}
