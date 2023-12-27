import Link from "next/link"
import { cookies } from "next/headers"
import Container from "@/components/Container"
import Cart from "@/components/Cart"
import NavItems from "@/components/NavItems"
import ThemeButton from "@/components/ThemeButton"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/Icons"
import { buttonVariants } from "@/components/ui/button"
import NavUserDropdown from "@/components/NavUserDropdown"
import { useGetUser } from "@/hooks/useGetUser"

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await useGetUser(nextCookies)
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-background">
      <header className="relative border-b bg-background border-muted-foreground/20">
        <Container>
          <div className="flex items-center h-16">
            {/* <MobileNav /> */}
            <div className="flex ml-4 lg:ml-0">
              <Link href="/">
                <Icons.logo className="w-10 h-10" />
              </Link>
            </div>
            <div className="z-50 hidden lg:ml-8 lg:block lg:self-stretch">
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
                <ThemeButton />
                <Separator orientation="vertical" className="h-6" aria-hidden />
                <Cart />
              </div>
            </div>
          </div>
        </Container>
      </header>
    </div>
  )
}
export default Navbar
