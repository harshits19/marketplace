import Link from "next/link"
import { cookies } from "next/headers"
import Container from "@/components/Container"
import FooterContent from "@/components/FooterContent"
import { useGetUser } from "@/hooks/useGetUser"

const Footer = async () => {
  const nextCookies = cookies()
  const { user } = await useGetUser(nextCookies)

  return (
    <footer className="flex-grow-0">
      <Container>
        <FooterContent link={user ? "/sell" : "/sign-in?as=seller"} />
        <div className="py-10 md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} All Rights Reserved</p>
          </div>

          <div className="mt-4 flex items-center justify-center md:mt-0">
            <div className="flex space-x-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-muted-foreground/80">
                Terms
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-muted-foreground/80">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-muted-foreground/80">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
