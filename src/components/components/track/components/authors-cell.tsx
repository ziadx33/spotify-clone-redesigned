import { SkeletonList } from "@/components/artist/components/skeleton";
import { TableCell } from "@/components/ui/table";
import { type ReactNode } from "react";

export type AuthorsCellProps = {
  isAlbum?: boolean;
  authorsElement: ReactNode;
  skeleton: boolean;
  isList: boolean;
};

export function AuthorsCell({
  isAlbum,
  authorsElement,
  isList,
  skeleton,
}: AuthorsCellProps) {
  return (
    !isAlbum && (
      <>
        {!isList ? (
          <TableCell className="flex gap-1">{authorsElement}</TableCell>
        ) : skeleton ? (
          <div className="flex gap-1">
            <SkeletonList amount={2} className="mt-2 h-2.5 w-10" />
          </div>
        ) : null}
      </>
    )
  );
}