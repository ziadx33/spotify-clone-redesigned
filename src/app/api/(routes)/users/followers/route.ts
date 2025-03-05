import { db } from "@/server/db";
import { type $Enums } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderBy = searchParams.get("orderBy") ?? "desc";
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const userType = searchParams.get("userType") as $Enums.USER_TYPE | null;
  const genre = searchParams.get("genre") as $Enums.GENRES | null;
  try {
    const users = await db.user.findMany({
      where: {
        genres: genre
          ? {
              has: genre,
            }
          : undefined,
        type: userType ?? undefined,
      },
      orderBy: {
        followers: orderBy as "desc" | "asc",
      },
      skip: from ? parseInt(from) : undefined,
      take: to ? parseInt(to) : undefined,
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
