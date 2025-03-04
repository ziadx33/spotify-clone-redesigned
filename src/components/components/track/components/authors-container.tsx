import { type Playlist, type User } from "@prisma/client";
import { Authors } from "./authors";
import { AuthorsCell, type AuthorsCellProps } from "./authors-cell";
import { IndexImage, type IndexImageProps } from "./index-image";
import { type Props } from "../types";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

type CompTypes = IndexImageProps & AuthorsCellProps;

type AuthorsContainerProps = {
  authors?: User[];
  viewAs: Props["viewAs"];
  playlist?: Playlist;
} & Omit<CompTypes, "authorsElement" | "isList">;

export function AuthorsContainer(props: AuthorsContainerProps) {
  const isList = props.viewAs === "LIST";
  const isMobile = useIsMobile();
  const authorsElement =
    !props.skeleton && !(isMobile && (props.authors?.length ?? 0) > 1) ? (
      <Authors authors={props.authors!} playlistId={props.playlist?.id} />
    ) : (
      <Link
        href={`/playlist/${props.track?.albumId}`}
        className="text-muted-foreground"
      >
        various artists
      </Link>
    );
  return (
    <>
      <IndexImage {...props} authorsElement={authorsElement} isList={isList} />
      <AuthorsCell {...props} authorsElement={authorsElement} isList={isList} />
    </>
  );
}
