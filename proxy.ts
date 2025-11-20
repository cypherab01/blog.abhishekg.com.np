import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";

const protectedRoutes = ["/admin", "/dashboard"];
const authRoutes = ["/auth/login", "/auth/register"];

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: RoleName };
  } catch {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Decode token if present
  const decoded = token ? await verifyToken(token) : null;

  // -------------------------
  // Protected Routes
  // -------------------------
  if (isProtected) {
    if (!decoded) {
      const res = NextResponse.redirect(new URL("/auth/login", req.url));
      if (token) res.cookies.set("accessToken", "", { maxAge: 0 });
      return res;
    }

    // Role-based access
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      pathname.startsWith("/dashboard") &&
      !["ADMIN", "BLOGGER"].includes(decoded.role)
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  // -------------------------
  // Auth routes
  // -------------------------
  if (isAuthRoute && decoded) {
    const redirectTo =
      decoded.role === RoleName.ADMIN ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
