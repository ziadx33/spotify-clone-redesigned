import { db } from "@/server/db";
import { type $Enums } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ value: string }> },
) {
  const { value } = await params;
  const searchParams = request.nextUrl.searchParams;
  const userType =
    (searchParams.get("userType") as $Enums.USER_TYPE | null) ?? "ARTIST";
  if (!value) return NextResponse.json({ error: "missing required args" });
  try {
    const users = await db.user.findMany({
      where: {
        type: userType,
        followers: {
          has: value,
        },
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
