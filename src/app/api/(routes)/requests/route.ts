"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const requests = await db.request.findMany({
      where: {
        AND: [
          {
            requestedUserIds: {
              has: userId,
            },
          },
          {
            requesterId: {
              not: userId,
            },
          },
        ],
      },
    });
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
