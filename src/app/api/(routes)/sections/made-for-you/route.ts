"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const historyTracksIds = searchParams.get("historyTracksIds");
  if (!historyTracksIds)
    return NextResponse.json({ error: "missing required args" });
  const parsedHistoryTracksIds = historyTracksIds.split(",");
  try {
    let historyTracks = await db.track.findMany({
      where: {
        id: {
          in: parsedHistoryTracksIds.slice(0, 50),
        },
      },
    });

    if (historyTracks.length === 0)
      historyTracks = await db.track.findMany({
        take: 50,
        orderBy: { plays: "asc" },
      });

    const historyTracksGenres = [
      ...new Set(
        historyTracks
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          .map((track) => track?.genres)
          .flat()
          .slice(0, 6),
      ),
    ];

    const authorsSet = [
      ...new Set(
        historyTracks
          ?.map((track) => [track.authorId, ...track.authorIds])
          .flat(),
      ),
    ];

    const authors = await db.user.findMany({
      where: {
        id: {
          in: authorsSet,
        },
      },
    });

    const data = historyTracksGenres.map((genre) => {
      const tracks = historyTracks.filter((track) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        track?.genres?.includes(genre),
      );
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        genre,
        tracks,
        authors: authors.filter((user) =>
          tracks
            .map((track) => [track.authorId, ...track.authorIds])
            .flat()
            .includes(user.id),
        ),
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
