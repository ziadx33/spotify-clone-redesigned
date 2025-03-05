import { db } from "@/server/db";
import { getTracksData } from "@/server/queries/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ playlistId: string }> },
) {
  const { playlistId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const albumData = Boolean(searchParams.get("albumData") ?? "0");
  const playlistIds = searchParams.get("playlistIds");
  const trackIds = searchParams.get("trackIds");
  const authorId = searchParams.get("authorId");
  const tracksData = Boolean(searchParams.get("tracksData") ?? "1");
  if (playlistId === "undefined" && !playlistIds)
    return NextResponse.json({ error: "missing required args" });
  const parsedPlaylistIds = playlistIds ? playlistIds.split(",") : undefined;
  const parsedTrackIds = trackIds ? trackIds.split(",") : undefined;
  try {
    const isArray =
      parsedPlaylistIds?.length ?? 0 > 0
        ? { hasSome: parsedPlaylistIds }
        : { has: playlistId };
    const tracks = await db.track.findMany({
      where: {
        ...(playlistId !== "undefined"
          ? !albumData
            ? {
                OR: [
                  {
                    playlists: isArray,
                  },
                  {
                    albumId: playlistId,
                  },
                ],
              }
            : {
                albumId:
                  playlistId !== "undefined"
                    ? playlistId
                    : {
                        in: parsedPlaylistIds,
                      },
              }
          : {
              id: {
                in: parsedTrackIds,
              },
            }),
        authorId: authorId ?? undefined,
      },
      orderBy: {
        order: "asc",
      },
    });
    const { authors, playlists: data } = tracksData
      ? await getTracksData({
          tracks: tracks,
        })
      : { authors: [], playlists: [] };
    return NextResponse.json({
      data: {
        tracks: tracks ?? [],
        authors: authors ?? [],
        albums: data ?? [],
      },
      status: "success",
      error: null,
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: (error as { message: string }).message,
      data: null,
    });
  }
}
