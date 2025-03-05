"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> },
) {
  const { trackId } = await params;
  if (!trackId) return NextResponse.json({ error: "track id is required" });
  try {
    const track = await db.track.findUnique({
      where: {
        id: trackId,
      },
    });
    return NextResponse.json(track);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch track." });
  }
}
