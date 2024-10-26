import { type Playlist, type User } from "@prisma/client";
import { Authors } from "./authors";
import { AuthorsCell, type AuthorsCellProps } from "./authors-cell";
import { IndexImage, type IndexImageProps } from "./index-image";
import { type Props } from "../types";

type CompTypes = IndexImageProps & AuthorsCellProps;

type AuthorsContainerProps = {
  authors?: User[];
  viewAs: Props["viewAs"];
  playlist?: Playlist;
} & Omit<CompTypes, "authorsElement" | "isList">;

export function AuthorsContainer(props: AuthorsContainerProps) {
  const isList = props.viewAs === "LIST";

  const authorsElement = !props.skeleton && (
    <Authors authors={props.authors!} playlistId={props.playlist?.id} />
  );
  return (
    <>
      <IndexImage {...props} authorsElement={authorsElement} isList={isList} />
      <AuthorsCell {...props} authorsElement={authorsElement} isList={isList} />
    </>
  );
}
