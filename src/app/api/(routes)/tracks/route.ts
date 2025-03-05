import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { type $Enums } from "@prisma/client";
import { getTracksData } from "@/server/queries/server";
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const artistId = searchParams.get("artistId");
  const type = searchParams.get("type") as $Enums.PLAYLIST_TYPE | null;
  const genres = searchParams.get("genres");
  const ids = searchParams.get("ids");
  const addTracksData = Boolean(searchParams.get("addTracksData") ?? "1");
  const range = {
    from: from ? parseInt(from) : undefined,
    to: to ? parseInt(to) : undefined,
  };
  const parsedGenres = genres
    ? (genres?.split(",") as $Enums.GENRES[])
    : undefined;
  const parsedIds = ids ? (ids?.split(",") as $Enums.GENRES[]) : undefined;
  try {
    const tracks = await db.track.findMany({
      where: {
        id: parsedIds
          ? {
              in: parsedIds,
            }
          : undefined,
        genres:
          parsedGenres?.length ?? 0 > 0
            ? {
                hasSome: parsedGenres,
              }
            : undefined,
        OR: artistId
          ? [
              {
                authorIds: {
                  has: artistId,
                },
              },
              { authorId: artistId },
            ]
          : undefined,

        album: type
          ? {
              type: type,
            }
          : undefined,
      },
      skip: range?.from,
      take: range?.to,
      orderBy: {
        dateAdded: "asc",
      },
    });
    const { authors, playlists: albums } = addTracksData
      ? await getTracksData({ tracks })
      : { authors: [], playlists: [] };
    const data = {
      tracks: tracks ?? [],
      albums: albums ?? [],
      authors: authors ?? [],
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
