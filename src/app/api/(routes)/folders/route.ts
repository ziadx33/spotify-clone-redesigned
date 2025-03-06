import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const keys = [`user-folders-${userId}`];
    const folders = await unstable_cache(
      async () => {
        return await db.folder.findMany({
          where: {
            userId,
          },
        });
      },
      keys,
      { tags: keys },
    )();
    return NextResponse.json(folders);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
