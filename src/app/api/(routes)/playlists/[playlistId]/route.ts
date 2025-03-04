"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> },
) {
  const { playlistId } = await params;
  if (!playlistId)
    return NextResponse.json({ error: "playlist id is required" });
  try {
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
    });
    return NextResponse.json(playlist);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch playlist." });
  }
}
