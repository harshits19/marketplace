"use client"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import CartItem from "@/components/CartItem"
import { Button, buttonVariants } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useCart } from "@/hooks/useCart"

const Cart = ({ variant }: { variant: "desktop" | "mobile" }) => {
  const { items, clearCart } = useCart()
  const itemCount = items.length
  const cartTotal = items.reduce((total, { product }) => total + product.price, 0)
  const fee = 100
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Sheet>
      <SheetTrigger asChild>
        {variant === "desktop" ? (
          <Button variant="ghost" className="relative">
            <ShoppingCart className="size-[18px]" aria-hidden="true" />
            {isMounted && items?.length > 0 && (
              <span className="bg-primary text-white absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] rounded-full">
                {items.length}
              </span>
            )}
          </Button>
        ) : (
          <div className="flex items-center p-4 duration-100 ease-in cursor-pointer hover:bg-muted/40">
            <span className="relative w-6">
              <ShoppingCart className="size-5" aria-hidden="true" />
              {isMounted && items?.length > 0 && (
                <span className="bg-primary text-white absolute -top-1 -right-2 size-3 flex items-center justify-center text-[9px] rounded-full">
                  {items.length}
                </span>
              )}
            </span>
            <span className="pl-3 leading-3">Cart</span>
          </div>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className="flex flex-row items-center justify-between pr-8 mt-2">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
          {items?.length > 0 && (
            <button
              className="px-3 py-1 text-sm transition-colors duration-100 rounded-md hover:bg-muted"
              onClick={() => clearCart()}>
              Clear
            </button>
          )}
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">
              <ScrollArea className="max-h-[50dvh] pr-4">
                {items.map(({ product }, idx) => (
                  <CartItem product={product} key={idx} variant="slide" />
                ))}
              </ScrollArea>
            </div>
            <div className="pr-6 space-y-4">
              <DropdownMenuSeparator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full text-white",
                    })}>
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-1">
            <div aria-hidden="true" className="relative w-40 mb-4 h-60 text-muted-foreground">
              <Image src="/popeye-looking.png" fill sizes="100vw" alt="empty shopping cart" />
            </div>
            <div className="text-xl font-semibold">Your cart is empty</div>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground",
                })}>
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
export default Cart
