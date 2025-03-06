import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> },
) {
  const { playlistId } = await params;
  if (!playlistId)
    return NextResponse.json({ error: "playlist id is required" });
  try {
    const keys = [`playlist-${playlistId}`];
    const playlist = await unstable_cache(
      async () => {
        return await db.playlist.findUnique({
          where: { id: playlistId },
        });
      },
      keys,
      { tags: keys },
    )();
    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch playlist." });
  }
}
