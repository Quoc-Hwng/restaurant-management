import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

//This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  //Chưa login thì không cho vào private paths
  const isAuth = Boolean(request.cookies.get("accessToken")?.value);
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //Nếu login thì không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

//See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/manage/:path*"],
};
