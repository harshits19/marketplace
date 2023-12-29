"use client"

import * as React from "react"
import { CheckIcon, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const ThemeButton = ({ variant }: { variant: "desktop" | "mobile" }) => {
  const { setTheme, theme } = useTheme()
  const [isMounted, setIsMounted] = React.useState<boolean>(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleTheme = () => {
    if (theme === "light") setTheme("dark")
    else setTheme("light")
  }
  if (variant === "mobile")
    return (
      <div
        className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40"
        onClick={handleTheme}>
        <span className="w-6">
          <Sun className="block size-5 dark:-rotate-90 dark:hidden" />
          <Moon className="hidden size-5 dark:rotate-0 dark:block" />
        </span>
        <span className="pl-3 leading-3">{isMounted && theme === "light" ? "Dark" : "Light"}</span>
      </div>
    )
  else
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-none outline-none no-focus">
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-x-1">
            {theme === "light" ? <CheckIcon className="w-4 h-4" /> : <span className="w-4 h-4" />}
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-x-1">
            {theme === "dark" ? <CheckIcon className="w-4 h-4" /> : <span className="w-4 h-4" />}
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-x-1">
            {theme === "system" ? <CheckIcon className="w-4 h-4" /> : <span className="w-4 h-4" />}
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
}
export default ThemeButton
