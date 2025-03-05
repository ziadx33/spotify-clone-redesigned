import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { getPlaylists } from "@/server/queries/playlist";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const artistIds = searchParams.get("artistIds");
  const artistId = searchParams.get("artistId");
  const addAlbums = Boolean(searchParams.get("addAlbums") ?? "0");
  if (!artistIds && !artistId)
    return NextResponse.json({ error: "missing required args" });
  const parsedArtistIds = artistIds?.split(",");
  const range = {
    from: from ? parseInt(from) : undefined,
    to: to ? parseInt(to) : undefined,
  };
  try {
    const defaultOptions = {
      where: {
        OR: [
          {
            authorId: artistId ? artistId : { in: parsedArtistIds },
          },
          {
            authorIds: artistId
              ? { has: artistId }
              : { hasSome: parsedArtistIds },
          },
        ],
      },
      skip: range?.from ?? 0,
      take:
        range?.to &&
        (parsedArtistIds && (parsedArtistIds?.length ?? 0 > 0)
          ? range?.to * parsedArtistIds.length
          : range?.to),
    };
    let tracks = await db.track.findMany({
      ...defaultOptions,
      orderBy: {
        plays: "desc",
      },
    });
    if (tracks.length === 0) tracks = await db.track.findMany(defaultOptions);
    const [authors, albums] = [
      await db.user.findMany({
        where: {
          OR: [
            { id: { in: tracks?.map((track) => track.authorId) } },
            {
              id: {
                in: tracks.map((track) => track?.authorIds ?? []).flat(),
              },
            },
          ],
        },
      }),
      addAlbums
        ? await getPlaylists({
            playlistIds: tracks?.map((track) => track.albumId),
          })
        : undefined,
    ];
    return NextResponse.json({
      tracks,
      authors: authors,
      albums: albums?.data,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
