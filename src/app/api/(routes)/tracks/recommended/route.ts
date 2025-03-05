import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/server/db";
import { getTracksData } from "@/server/queries/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const artistIds = searchParams.get("artistIds");
  const trackIds = searchParams.get("trackIds");
  if (!artistIds || !trackIds)
    return NextResponse.json({ error: "missing required args" });
  const parsedArtistIds = artistIds.split(",");
  const parsedTrackIds = trackIds.split(",");
  const range = {
    from: from ? parseInt(from) : undefined,
    to: to ? parseInt(to) : undefined,
  };
  try {
    let tracks = await db.track.findMany({
      where: {
        id: {
          notIn: parsedTrackIds,
        },
        OR: [
          {
            authorId: {
              in: parsedArtistIds,
            },
          },
          { authorIds: { hasSome: parsedArtistIds } },
        ],
      },
      skip: range.from,
      take: range.to,
    });

    if (tracks.length === 0)
      tracks = await db.track.findMany({
        skip: range.from,
        take: range.to,
      });
    const { authors, playlists: data } = await getTracksData({ tracks });
    return NextResponse.json({
      tracks: tracks ?? [],
      authors,
      albums: data ?? [],
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
