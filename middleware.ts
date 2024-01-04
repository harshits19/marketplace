import { NextRequest, NextResponse } from "next/server"
import { useGetUser } from "./hooks/useGetUser"

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req
  const { user } = await useGetUser(cookies)
  if (!user?.id) {
    console.log("no user")
    if (nextUrl.pathname.startsWith("/wishlist") || nextUrl.pathname.startsWith("/orders")) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/sign-in?origin=${nextUrl.pathname.slice(1)}`)
    }
  } else {
    console.log("user", user)
    if (nextUrl.pathname.startsWith("/sign-in") || nextUrl.pathname.startsWith("/sign-up")) {
      if (nextUrl.search.includes("?origin=")) {
        const param = nextUrl.search.slice(8)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/${param}`)
      } else return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`)
    }
  }
  return NextResponse.next()
}
