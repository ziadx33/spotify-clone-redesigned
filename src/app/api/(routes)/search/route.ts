import { getPlaylistsBySearchQuery } from "@/server/queries/playlist";
import { getTracksBySearchQuery } from "@/server/queries/track";
import { getUser, getUsersBySearchQuery } from "@/server/queries/user";
import { handleRequests } from "@/utils/handle-requests";
import { type Playlist, type Track, type User } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

type TopSearchType =
  | { data: Track; type: "track" }
  | { data: User; type: "author" }
  | { data: Playlist; type: "playlist" };

export type SearchResponse = {
  topSearch?: TopSearchType;
  topSearchCreator?: User | null;
  tracks: {
    tracks: Track[];
    authors: User[];
    albums: Playlist[];
  };
  playlists: {
    playlists: Playlist[];
    authors: User[];
  } | null;
  authors: User[];
};

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchResponse | { error: unknown }>> {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";
  console.log("men embare7", query);
  try {
    const requests = [
      getTracksBySearchQuery({
        query,
        amount: 15,
        restartLength: 1,
      }),
      getPlaylistsBySearchQuery({ query, amount: 15 }),
      getUsersBySearchQuery({ query, amount: 15 }),
    ] as const;

    console.log("fk off");
    const [tracks, playlists, authors] = await handleRequests(requests);
    const returnAuthors = authors instanceof Array ? authors : [];

    const containsQuery = (text: string) =>
      text.toLowerCase().includes(query.toLowerCase());

    const topTrack = tracks.tracks.find((track) => containsQuery(track.title));
    const topPlaylist = playlists?.playlists.find((playlist) =>
      containsQuery(playlist.title),
    );
    const topAuthor = returnAuthors.find((author) =>
      containsQuery(author.name),
    );

    const topSearch: TopSearchType | undefined = topTrack
      ? { data: topTrack, type: "track" }
      : topPlaylist
        ? { data: topPlaylist, type: "playlist" }
        : topAuthor
          ? { data: topAuthor, type: "author" }
          : undefined;

    const userId =
      topSearch?.type !== "author"
        ? topSearch?.type === "playlist"
          ? topSearch.data.creatorId
          : topSearch?.data.authorId
        : undefined;

    const topSearchCreator =
      topSearch?.type !== "author"
        ? returnAuthors.find((author) => author.id === userId) ??
          (await getUser({ id: userId }))
        : undefined;
    const sortedTracks = {
      ...tracks,
      tracks: [...tracks.tracks].sort((a, b) => {
        if (a.authorId === userId || a.id === topTrack?.id) return -1;
        if (b.authorId === userId || b.id === topTrack?.id) return 1;
        return 0;
      }),
    };
    return NextResponse.json({
      topSearch,
      topSearchCreator,
      tracks: sortedTracks,
      playlists,
      authors: returnAuthors,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
