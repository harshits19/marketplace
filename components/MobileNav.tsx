"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/Icons"
import Cart from "@/components/Cart"
import ThemeButton from "@/components/ThemeButton"
import { Button } from "@/components/ui/button"
import { useLogoutUser } from "@/hooks/useLogoutUser"
import {
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Highlighter,
  LogIn,
  LogOut,
  Menu,
  UserCircle,
} from "lucide-react"
import { User } from "@/server/payload-types"
import { cn } from "@/lib/utils"

const MobileNav = ({ user }: { user: User }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { signOut } = useLogoutUser()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative flex items-center justify-center p-2 rounded-full md:hidden hover:bg-muted">
        <Menu className="size-6" aria-hidden="true" />
      </button>
      <div
        className={cn(
          "fixed right-0 z-50 bg-background top-0 block h-full w-56 overflow-y-auto transition-transform duration-200 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-56"
        )}>
        <div className="relative flex items-center h-16 px-3 border-b border-muted " onClick={() => setIsOpen(false)}>
          <ChevronRight className="p-2 rounded-full cursor-pointer h-9 w-9" />
        </div>
        <div className="flex flex-col">
          <Link href="/" className="contents">
            <ThemeButton variant="mobile" />
            <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
              <Icons.home className="size-6" />
              <span className="pl-3 leading-3">Home</span>
            </div>
          </Link>
          <Link href="/" className="contents">
            <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
              <span className="w-6">
                <UserCircle className="size-5" />
              </span>
              <span className="pl-3 leading-3">Account</span>
            </div>
          </Link>
          <Cart variant="mobile" />
          <Link href="/products?category=icons" className="contents">
            <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
              <span className="w-6">
                <Highlighter className="size-5" />
              </span>
              <span className="pl-3 leading-3">Icons</span>
            </div>
          </Link>
          <Link href="/products?category=ui_kits" className="contents">
            <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
              <span className="w-6">
                <CalendarDays className="size-5" />
              </span>
              <span className="pl-3 leading-3">UI Kits</span>
            </div>
          </Link>
          <Link href="/sell" className="contents">
            <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
              <span className="w-6">
                <CircleDollarSign className="size-5" />
              </span>
              <span className="pl-3 leading-3">Sell</span>
            </div>
          </Link>
        </div>
        <div className="absolute left-0 ml-4 bottom-5">
          {user ? (
            <Button size="sm" className="gap-x-1.5" onClick={signOut}>
              <LogOut className="size-4" />
              Logout
            </Button>
          ) : (
            <Button size="sm" className="gap-x-1.5" asChild>
              <Link href="/sign-in">
                Sign in
                <LogIn className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 w-full h-full bg-foreground/20 dark:bg-muted/30"
          onClick={() => setIsOpen(false)}></div>
      )}
    </>
  )
}

export default MobileNav
