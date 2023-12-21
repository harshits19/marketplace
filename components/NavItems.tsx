"use client"

import { PRODUCT_CATEGORIES } from "@/lib/config"
import { useEffect, useRef, useState } from "react"
import NavItem from "./NavItem"
import { useClickOutside } from "@/hooks/useClickOutside"

type Category = (typeof PRODUCT_CATEGORIES)[number]

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null)
  const isAnyOpen = activeIndex !== null
  const navRef = useRef<HTMLDivElement | null>(null)
  const close = () => setActiveIndex(null)
  useClickOutside(navRef, close)
  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", handleClose)
    return () => document.removeEventListener("keydown", handleClose)
  }, [])

  return (
    <div className="flex h-full gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category: Category, idx) => {
        const handleOpen = () => {
          if (activeIndex !== idx) setActiveIndex(idx)
          else close()
        }
        const isOpen = idx === activeIndex
        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            close={close}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        )
      })}
    </div>
  )
}
export default NavItems
