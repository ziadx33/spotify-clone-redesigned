import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env";
import { AUTH_ROUTES } from "./constants";

export async function middleware(request: NextRequest) {
  const session = await getToken({ req: request, secret: env.NEXTAUTH_SECRET });

  const isAuthRoute = AUTH_ROUTES.includes(
    request.nextUrl.pathname as (typeof AUTH_ROUTES)[number],
  );

  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (isAuthRoute && session)
    return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
