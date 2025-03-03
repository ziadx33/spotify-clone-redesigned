import { db } from "@/server/db";
import { type User, type $Enums } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const amount = searchParams.get("amount");
  const type = searchParams.get("amount") as $Enums.USER_TYPE | null;
  const restartLength = searchParams.get("restartLength");

  if (!query) return NextResponse.json({ error: "missing required args" });
  try {
    const parsedRestartLength = restartLength ? parseInt(restartLength) : null;
    const parsedAmount = amount ? parseInt(amount) : null;
    let users = await db.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        type: type ?? undefined,
      },
      take: parsedAmount ?? undefined,
    });

    if (users.length === 0 || (parsedRestartLength ?? 0) >= users.length) {
      const firstUser = users.length > 0 ? (users as [User])[0] : false;
      users = [
        firstUser,
        ...(await db.user.findMany({ take: parsedAmount ?? undefined })).filter(
          (user) => user.id !== (firstUser ? firstUser.id : null),
        ),
      ].filter((v) => v) as User[];
    }

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
