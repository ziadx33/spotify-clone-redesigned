"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const searchParams = request.nextUrl.searchParams;
  const { value } = await params;
  type ValueType = "id" | "email";
  const type = (searchParams.get("type") as ValueType | null) ?? "id";
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const user = await db.tab.findMany({
      where: type === "id" ? { id: value } : { User: { email: value } },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
