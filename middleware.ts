import { NextResponse, type NextRequest } from "next/server"
import { LANGUAGE_COOKIE_KEY } from "@/lib/redesign/config"
import { LANG_HEADER, languageFromAccept, isLanguage } from "@/lib/redesign/language"

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(LANGUAGE_COOKIE_KEY)?.value
  const lang = isLanguage(existing)
    ? existing
    : languageFromAccept(request.headers.get("accept-language"))

  const headers = new Headers(request.headers)
  headers.set(LANG_HEADER, lang)

  const response = NextResponse.next({
    request: { headers },
  })

  if (!isLanguage(existing)) {
    response.cookies.set(LANGUAGE_COOKIE_KEY, lang, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)"],
}
