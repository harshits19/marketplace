import Link from "next/link"
import Container from "@/components/Container"
import { Icons } from "@/components/Icons"
import NavItems from "@/components/NavItems"
import ThemeButton from "@/components//ThemeButton"
import Cart from "./Cart"
import { buttonVariants } from "./ui/button"

const Navbar = () => {
  const user = null
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 bg-background">
      <header className="relative bg-background border-b border-muted-foreground/20">
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
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-3">
                {user ? null : (
                  <>
                    <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                      Sign in
                    </Link>
                    <div className="h-6 w-px bg-muted-foreground/20" aria-hidden="true" />
                  </>
                )}
                <ThemeButton />
                <div className="h-6 w-px bg-muted-foreground/20" aria-hidden="true" />
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
