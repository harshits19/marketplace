import { NextRequest, NextResponse } from "next/server"
import { useGetUser } from "./hooks/useGetUser"

export const config = {
  matcher: ["/sign-in", "/sign-up"],
}

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { user } = await useGetUser(cookies)
  if (user) {
    if (nextUrl.search.includes("?origin=")) {
      const param = nextUrl.search.slice(8)
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/${param}`)
    } else return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`)
  }
  return NextResponse.next()
}
