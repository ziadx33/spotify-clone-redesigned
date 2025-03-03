"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (!userId) return NextResponse.json({ error: "missing required args" });
  try {
    const prefrence = await db.preference.findUnique({
      where: {
        userId,
      },
    });
    return NextResponse.json(prefrence);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
