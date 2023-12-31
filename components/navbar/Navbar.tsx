import Link from "next/link"
import { cookies } from "next/headers"
import Container from "@/components/Container"
import Cart from "@/components/navbar/Cart"
import NavItems from "@/components/navbar/NavItems"
import ThemeButton from "@/components/ThemeButton"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/Icons"
import { buttonVariants } from "@/components/ui/button"
import NavUserDropdown from "@/components/navbar/NavUserDropdown"
import MobileNav from "@/components/navbar/MobileNav"
import { useGetUser } from "@/hooks/useGetUser"

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await useGetUser(nextCookies)
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-background">
      <header className="relative border-b bg-background border-muted-foreground/20">
        <Container>
          <div className="flex items-center h-16">
            <div className="flex ml-4 lg:ml-0">
              <Link href="/">
                <Icons.logo className="w-10 h-10" />
              </Link>
            </div>
            <div className="flex justify-end w-full md:hidden">
              <MobileNav user={user} />
            </div>
            <div className="z-50 hidden ml-8 md:block self-stretch">
              <NavItems />
            </div>
            <div className="flex items-center ml-auto">
              <div className="items-center justify-end flex-1 hidden gap-x-3 md:flex">
                {user ? (
                  <NavUserDropdown user={user} />
                ) : (
                  <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
                    Sign in
                  </Link>
                )}
                <Separator orientation="vertical" className="h-6" aria-hidden />
                <ThemeButton variant="desktop" />
                <Separator orientation="vertical" className="h-6" aria-hidden />
                <Cart variant="desktop" />
              </div>
            </div>
          </div>
        </Container>
      </header>
    </div>
  )
}
export default Navbar
