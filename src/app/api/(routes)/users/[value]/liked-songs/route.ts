"use server";

import { db } from "@/server/db";
import { getTracksData } from "@/server/queries/track";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const tracks = await db.track.findMany({
      where: { likedUsers: { has: value } },
    });

    const { authors, playlists: albums } = await getTracksData({ tracks });

    return NextResponse.json({ tracks, authors, albums });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
