import { db } from "@/server/db";
import { unstable_cache } from "next/cache";
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
    const keys = [`user-${value}`];
    const user = await unstable_cache(
      async () => {
        return await db.user.findUnique({
          where: type === "id" ? { id: value } : { email: value },
        });
      },
      keys,
      { tags: keys },
    )();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
