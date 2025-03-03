"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ids = searchParams.get("ids");
  if (!ids) return NextResponse.json({ error: "missing required args" });
  const parsedIds = ids.split(",") || [];
  try {
    const user = await db.user.findMany({
      where: {
        id: {
          in: parsedIds,
        },
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
