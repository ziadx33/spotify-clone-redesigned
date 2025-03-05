import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const tracks = await db.track.findMany({
      where: {
        authorIds: {
          has: value,
        },
      },
    });
    const albums = await db.playlist.findMany({
      where: {
        creatorId: {
          not: value,
        },
        id: {
          in: tracks.map((track) => track.playlists).flat(),
        },
        type: {
          not: "PLAYLIST",
        },
      },
    });
    return NextResponse.json(albums);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
