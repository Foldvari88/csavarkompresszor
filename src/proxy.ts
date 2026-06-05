import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "admin";
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Basic ")) {
    const decoded = atob(authorization.slice(6));
    const [suppliedUsername, suppliedPassword] = decoded.split(":");
    if (suppliedUsername === username && suppliedPassword === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Admin hozzáférés szükséges.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Kalkulator admin"'
    }
  });
}

export const config = {
  matcher: ["/admin/:path*"]
};
