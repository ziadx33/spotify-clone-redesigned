import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const searchHistory = await db.searchHistory.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json(searchHistory);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
