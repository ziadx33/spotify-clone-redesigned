import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const keys = [`user-search-history-${userId}`];
    const searchHistory = await unstable_cache(
      async () => {
        return await db.searchHistory.findMany({
          where: {
            userId,
          },
        });
      },
      keys,
      { tags: keys },
    )();
    return NextResponse.json(searchHistory);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
