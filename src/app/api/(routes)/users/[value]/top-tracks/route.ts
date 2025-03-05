import { getTracksData } from "@/server/queries/server";
import { getTracks } from "@/server/queries/track";
import { getUser } from "@/server/queries/user";
import { getTopRepeatedNumbers } from "@/utils/get-top-repeated-numbers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  if (!value) return NextResponse.json({ error: "missing required args" });
  const searchParams = request.nextUrl.searchParams;
  const tracksOnly = Boolean(parseInt(searchParams.get("tracksOnly") ?? "0"));
  const artistId = searchParams.get("artistId");
  const user = await getUser({ id: value });
  try {
    const trackHistory = user?.tracksHistory ?? [];
    const trackIds = getTopRepeatedNumbers(trackHistory);
    const { tracks } = await getTracks({
      ids: trackIds.map((trackIds) => trackIds.id),
      artistId: artistId ?? undefined,
    });
    const data = !tracksOnly ? await getTracksData({ tracks }) : undefined;
    return NextResponse.json({
      data: {
        tracks: tracks ?? [],
        albums: data?.playlists ?? [],
        authors: data?.authors ?? [],
      },
      trackIds,
    });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
