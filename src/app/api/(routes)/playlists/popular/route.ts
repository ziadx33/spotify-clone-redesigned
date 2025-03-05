import { db } from "@/server/db";
import { type $Enums } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as $Enums.GENRES | null;
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  try {
    const defaultOptions: Parameters<typeof db.playlist.findMany>["0"] = {
      where: {
        genres: type
          ? {
              has: type,
            }
          : undefined,
        visibility: "PUBLIC",
      },
      skip: from ? parseInt(from) : undefined,
      take: to ? parseInt(to) : undefined,
    };
    const artists = await db.user.findMany({
      orderBy: {
        followers: "asc",
      },
      take: 20,
    });

    let playlists = await db.playlist.findMany({
      ...defaultOptions,
      where: {
        ...defaultOptions.where,
        creatorId: {
          in: artists.map((artist) => artist.id),
        },
      },
      take: 20,
    });

    if (playlists.length === 0) {
      playlists = await db.playlist.findMany(defaultOptions);
    }

    return NextResponse.json({ playlists, authors: artists });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch playlists." });
  }
}
