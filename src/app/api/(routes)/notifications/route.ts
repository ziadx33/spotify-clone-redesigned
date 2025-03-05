import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const notifications = await db.notification.findMany({
      where: {
        artist: {
          followers: {
            has: userId,
          },
        },
      },
    });
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
