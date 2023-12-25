"use client"
import Link from "next/link"
import Image from "next/image"
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ShoppingCart } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const Cart = () => {
  const itemCount = 1
  const fee = 1
  const cartTotal = 0
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <ShoppingCart className="w-[18px] h-[18px]" aria-hidden="true" />
          {/* <span className="ml-2 text-sm font-medium opacity-60 dark:opacity-100 group-hover:opacity-90">{0}</span> */}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">
              {/*  <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem product={product} key={product.id} />
                ))}
              </ScrollArea> */}
            </div>
            <div className="pr-6 space-y-4">
              <DropdownMenuSeparator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
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
            <div aria-hidden="true" className="relative mb-4 h-60 w-96 text-muted-foreground">
              <Image src="/popeye-looking.png" fill alt="empty shopping cart" />
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
