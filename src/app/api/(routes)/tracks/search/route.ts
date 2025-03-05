import { db } from "@/server/db";
import { getTracksData } from "@/server/queries/server";
import { type $Enums, type Track } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const amount = searchParams.get("amount");
  const restartLength = searchParams.get("restartLength");
  const skip = searchParams.get("skip");
  const type = searchParams.get("type") as $Enums.USER_TYPE | null;
  const disablePlaylists = searchParams.get("disablePlaylists") ?? "0";

  if (!query) return NextResponse.json({ error: "missing required args" });
  try {
    const parsedAmount = amount ? parseInt(amount) : undefined;
    const parsedSkip = skip ? parseInt(skip) : undefined;
    let tracks = await db.track.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: parsedAmount,
      skip: parsedSkip,
    });
    if ([0, restartLength].includes(tracks.length))
      tracks = [
        tracks.length > 0 ? (tracks as [Track])[0] : false,
        ...(
          await db.track.findMany({ take: parsedAmount, skip: parsedSkip })
        ).filter((track) => track.id !== tracks[0]?.id),
      ].filter((v) => v) as Track[];
    const { authors, playlists: data } = await getTracksData({
      tracks,
      disable: { playlists: Boolean(disablePlaylists) },
      artistType: type ?? undefined,
    });
    return NextResponse.json({
      tracks: tracks ?? [],
      authors,
      albums: data ?? [],
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
