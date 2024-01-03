"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

type Category = (typeof PRODUCT_CATEGORIES)[number]
interface NavItemProps {
  category?: Category
  handleOpen: (arg1: number, arg2: number | null) => void
  close: () => void
  isAnyOpen: boolean
  index: number
  activeIndex: number | null
}

const NavItem = ({ category, handleOpen, close, isAnyOpen, activeIndex, index }: NavItemProps) => {
  const isOpen = index === activeIndex
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={() => handleOpen(index, activeIndex)}
          variant={isOpen ? "secondary" : "ghost"}>
          {category?.label}
          {category?.featured && (
            <ChevronDown
              className={cn("h-4 w-4 transition-all text-muted-foreground", {
                "-rotate-180": isOpen,
              })}
            />
          )}
        </Button>
      </div>
      {isOpen && category?.featured ? (
        <div
          onClick={() => close()}
          className={cn("absolute inset-x-0 top-full text-sm text-muted-foreground", {
            "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen,
          })}>
          <div className="absolute inset-0 top-1/2 bg-background shadow" aria-hidden="true" />

          <div className="relative bg-background">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category?.featured.map((item) => (
                    <div onClick={() => close} key={item.name} className="group relative text-base sm:text-sm">
                      <Link href={item.href} className="contents">
                        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted/30 group-hover:opacity-80 transition-opacity duration-100">
                          <Image
                            src={item.imageSrc}
                            alt="product category image"
                            sizes="(max-width: 768px) 100vw,33vw"
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                        <span className="mt-6 block font-medium text-foreground">{item.name}</span>
                      </Link>
                      <p className="mt-1" aria-hidden="true">
                        Shop now
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
export default NavItem
