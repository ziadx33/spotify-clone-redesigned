import { db } from "@/server/db";
import { getTracksData } from "@/server/queries/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  const searchParams = request.nextUrl.searchParams;
  const take = searchParams.get("take");
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const tracks = await db.track.findMany({
      where: {
        OR: [{ authorId: value }, { authorIds: { has: value } }],
      },
      take: take ? parseInt(take) : undefined,
    });

    const data = await getTracksData({ artistType: "ARTIST", tracks });

    return NextResponse.json({ data, tracks });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
