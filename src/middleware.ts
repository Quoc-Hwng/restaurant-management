import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

//This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  //pathname: /manage/dashboard

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  //Chưa login thì không cho vào private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  //Nếu login thì không cho vào login nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Login nhưng accessToken hết hạn
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL("/logout", request.url);
    url.searchParams.set("refreshToken", refreshToken);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

//See "Matching Paths" below to learn more
export const config = {
  matcher: ["/login", "/manage/:path*"],
};
