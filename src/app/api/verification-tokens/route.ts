"use server";

import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  if (!token && !email)
    return NextResponse.json({ error: "token is required" });
  try {
    const verificationToken = email
      ? await db.verificationToken?.findFirst({
          where: {
            email: email,
          },
        })
      : await db.verificationToken?.findUnique({
          where: {
            token: token!,
          },
        });
    return NextResponse.json(verificationToken);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
