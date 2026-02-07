// import { NextResponse } from "next/server";

// export function middleware(req) {
//   const { pathname } = req.nextUrl;

//   // Allow static files & API routes
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   // Read cookie SAFELY
//   const session = req.cookies.get("admin_session")?.value;
//   const isLoggedIn = session === "true";

//   // Not logged in → block dashboard
//   if (!isLoggedIn && pathname === "/") {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Logged in → block login page
//   if (isLoggedIn && pathname === "/login") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/", "/login"]
// };

import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow static files & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get("admin_session")?.value;
  const isLoggedIn = session === "true";

  // 🔒 Protect dashboard + student pages
  if (
    !isLoggedIn &&
    (pathname === "/" || pathname.startsWith("/students"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 Prevent logged-in users from seeing login page
  if (isLoggedIn && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/students/:path*"]
};
