import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { readPayload } from "./utils/jwt";

export const proxy = async (request: NextRequest) => {
  // logging api request
  if (request.url.includes("/api")) {
    console.log("API", request.method, request.url);
  }

  const { pathname } = request.nextUrl;
  const isPublicRoutes = ["/", "/login", "/signup"].includes(pathname);
  const isProtectedRoutes = ["/onboarding"].includes(pathname);

  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  const isAuthenticated = !!token;

  if (isPublicRoutes && isAuthenticated) {
    // if logged in cant access the public route
    return NextResponse.redirect(new URL("/onboarding", request.url));
  } else if (isProtectedRoutes && !isAuthenticated) {
    // only authenticated can access this
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // api protection for chat/lesson need an account
  if (
    request.url.includes("/api/onboarding") ||
    request.url.includes("/api/lesson")
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({
        code: 401,
        error: "Unauthorized!",
      });
    }

    const tokenData = readPayload(token.value) as {
      id: string;
      email: string;
    };

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", tokenData.id);
    requestHeaders.set("x-user-email", tokenData.email);

    return NextResponse.next({
      headers: requestHeaders,
    });
  }

  return NextResponse.next();
};
