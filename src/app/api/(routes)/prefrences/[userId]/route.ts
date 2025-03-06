import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!userId) return NextResponse.json({ error: "missing required args" });
  try {
    const keys = [`user-prefrence-${userId}`];
    const prefrence = await unstable_cache(
      async () => {
        return await db.preference.findUnique({
          where: {
            userId,
          },
        });
      },
      keys,
      { tags: keys },
    )();
    return NextResponse.json(prefrence);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
