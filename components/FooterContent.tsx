"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/Icons"

const FooterContent = ({ link }: { link: string }) => {
  const pathname = usePathname()
  const pathsToMinimize = ["/sign-up", "/sign-in"]
  return (
    <div className="border-t border-muted/60">
      {pathsToMinimize.includes(pathname) ? null : (
        <div className="pb-8 pt-16">
          <div className="flex justify-center">
            <Icons.logo className="h-12 w-auto" />
          </div>
        </div>
      )}
      {pathsToMinimize.includes(pathname) ? null : (
        <div>
          <div className="relative flex items-center px-6 py-6 sm:py-8 lg:mt-0">
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <div aria-hidden="true" className="absolute bg-muted/80 inset-0 bg-gradient-to-br bg-opacity-90" />
            </div>

            <div className="text-center relative mx-auto max-w-sm">
              <h3 className="font-semibold ">Become a seller</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If you&apos;d like to sell high-quality digital products, you can do so in minutes.{" "}
                <Link href={link} className="whitespace-nowrap font-medium ">
                  Get started &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default FooterContent
