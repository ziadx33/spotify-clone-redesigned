import { db } from "@/server/db";
import { getUserByIds } from "@/server/queries/user";
import { type $Enums } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const creatorId = searchParams.get("creatorId");
  const playlistIds = searchParams.get("playlistIds");
  const orderByDate = searchParams.get("orderByDate") as "asc" | "desc" | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const genre = searchParams.get("genre") as $Enums.GENRES | null;
  const addAuthors = searchParams.get("addAuthors");
  const playlistIdsParsed = playlistIds?.split(",");
  const type =
    (searchParams.get("type") as $Enums.PLAYLIST_TYPE | null) ?? undefined;
  const excludedIds = searchParams.get("excludedIds");
  const excludedIdsParsed = excludedIds ? excludedIds.split(",") : undefined;
  try {
    const playlists = await db.playlist.findMany({
      where: {
        genres: genre
          ? {
              has: genre,
            }
          : undefined,
        OR: [
          { creatorId: creatorId ?? undefined },
          {
            id: {
              in: playlistIdsParsed?.length ? playlistIdsParsed : undefined,
              notIn: excludedIdsParsed,
            },
          },
        ],
        id: { notIn: excludedIdsParsed },
        type,
      },
      orderBy: orderByDate
        ? {
            createdAt: orderByDate,
          }
        : undefined,
      skip: from ? parseInt(from) : undefined,
      take: to ? parseInt(to) : undefined,
    });
    if (Boolean(addAuthors)) {
      const authors = await getUserByIds({
        ids: playlists.map((playlist) => playlist.creatorId),
      });
      return NextResponse.json({ authors, playlists });
    }
    return NextResponse.json(playlists);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch playlists." });
  }
}
