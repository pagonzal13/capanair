import { NextRequest, NextResponse } from "next/server";
import { SITE_COOKIE_NAME, verifySiteSessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SITE_COOKIE_NAME)?.value;
  const isValid = await verifySiteSessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/acceso";
  url.search = "";
  if (request.nextUrl.pathname !== "/") {
    url.searchParams.set("redirect", request.nextUrl.pathname);
  }
  return NextResponse.redirect(url);
}

// El panel /admin tiene su propia contraseña y gestion de sesion
// independiente (ver src/app/admin), por eso queda excluido aqui.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|acceso|admin).*)"],
};
