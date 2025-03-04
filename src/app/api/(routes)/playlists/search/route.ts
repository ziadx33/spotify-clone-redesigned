import { db } from "@/server/db";
import { getUserByIds } from "@/server/queries/user";
import { Playlist } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const amount = searchParams.get("amount");
  const restartLength = searchParams.get("restartLength");

  if (!query) return NextResponse.json({ error: "missing required args" });
  try {
    const parsedAmount = amount ? parseInt(amount) : undefined;
    let playlists = await db.playlist.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      take: parsedAmount,
    });
    const parsedRestartLength = restartLength
      ? parseInt(restartLength)
      : undefined;
    if (
      playlists.length === 0 ||
      playlists.length < (parsedRestartLength ?? 0)
    ) {
      const firstUser =
        playlists.length > 0 ? (playlists as [Playlist])[0] : false;
      playlists = [
        firstUser,
        ...(await db.playlist.findMany({ take: parsedAmount })).filter(
          (user) => user.id !== (firstUser ? firstUser.id : null),
        ),
      ].filter((v) => v) as Playlist[];
    }

    const authors = await getUserByIds({
      ids: playlists.map((playlist) => playlist.creatorId),
    });

    return NextResponse.json({ playlists, authors });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
