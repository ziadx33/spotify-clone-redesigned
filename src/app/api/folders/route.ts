"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("like that");
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId is required" });
  try {
    const folders = await db.folder.findMany({
      where: {
        userId,
      },
    });
    return NextResponse.json({ data: folders });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
