"use client"

import { PRODUCT_CATEGORIES } from "@/lib/config"
import { useEffect, useRef, useState } from "react"
import NavItem from "@/components/navbar/NavItem"
import { useClickOutside } from "@/hooks/useClickOutside"

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
  const handleOpen = (idx: number, activeIndex: number | null) => {
    if (activeIndex !== idx) setActiveIndex(idx)
    else close()
  }
  return (
    <div className="flex h-full gap-2" ref={navRef}>
      <NavItem
        key={PRODUCT_CATEGORIES[0].value}
        category={PRODUCT_CATEGORIES[0]}
        handleOpen={handleOpen}
        close={close}
        isAnyOpen={isAnyOpen}
        index={0}
        activeIndex={activeIndex}
      />
      <NavItem
        key={PRODUCT_CATEGORIES[1].value}
        category={PRODUCT_CATEGORIES[1]}
        handleOpen={handleOpen}
        close={close}
        isAnyOpen={isAnyOpen}
        index={1}
        activeIndex={activeIndex}
      />
      <NavItem
        key={PRODUCT_CATEGORIES[2].value}
        category={PRODUCT_CATEGORIES[2]}
        handleOpen={handleOpen}
        close={close}
        isAnyOpen={isAnyOpen}
        index={2}
        activeIndex={activeIndex}
      />
    </div>
  )
}
export default NavItems
