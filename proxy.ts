import { RoleName } from "@prisma/client";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: RoleName };
  } catch (err) {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("accessToken")?.value;

  const protectedRoutes = ["/admin", "/dashboard"];
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const decoded = await verifyToken(token);

    if (!decoded) {
      const res = NextResponse.redirect(new URL("/auth/login", req.url));
      res.cookies.set("accessToken", "", { maxAge: 0 });
      return res;
    }

    if (pathname.startsWith("/admin") && decoded.role !== RoleName.ADMIN) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (
      pathname.startsWith("/dashboard") &&
      decoded.role !== RoleName.BLOGGER
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
