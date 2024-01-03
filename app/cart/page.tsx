"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import CartItem from "@/components/navbar/CartItem"
import { Button } from "@/components/ui/button"
import { trpc } from "@/server/trpc/client"
import { useCart } from "@/hooks/useCart"
import { cn, formatPrice } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const CartPage = () => {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url)
        clearCart()
      }
    },
  })
  const productIds = items.map(({ product }) => product.id)
  const subTotalFee = items.reduce((total, { product }) => total + product.price, 0)
  const tsFee = 100
  const totalFee = subTotalFee + tsFee
  return (
    <div className="max-w-2xl px-4 pt-16 pb-24 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shopping Cart</h1>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <div
          className={cn("lg:col-span-7", {
            "rounded-lg border-2 border-dashed border-muted": isMounted && items.length === 0,
          })}>
          <h2 className="sr-only">Items in your shopping cart</h2>
          {isMounted && items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4">
              <div aria-hidden className="relative w-40 mb-4 h-60">
                <Image src="/popeye-looking.png" fill alt="empty cart" sizes="50vw" loading="eager" />
              </div>
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-sm text-center text-muted-foreground">Whoops! Nothing to show here</p>
            </div>
          ) : null}
          {isMounted && items.length ? (
            <div className="w-full pr-1 overflow-y-auto divide-y max-h-96 divide-solid divide-muted cartItemBox">
              {items.map(({ product }, idx) => (
                <CartItem product={product} key={idx} variant="page" />
              ))}
            </div>
          ) : null}
        </div>
        <section className="px-4 py-6 mt-16 rounded-lg sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 bg-muted/80">
          <h2 className="text-lg font-medium">Order summary</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-sm font-medium">
                {isMounted ? (
                  formatPrice(subTotalFee)
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-muted-foreground/20">
              <span className="text-sm text-muted-foreground">Flat Transaction Fee</span>
              <span className="text-sm font-medium">
                {isMounted ? formatPrice(tsFee) : <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-muted-foreground/20">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-sm font-medium">
                {isMounted ? formatPrice(totalFee) : <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
              </span>
            </div>
          </div>
          <Button
            className="w-full mt-6"
            size="lg"
            disabled={(isMounted && items.length === 0) || isLoading}
            onClick={() => createCheckoutSession({ productIds })}>
            {isLoading ? <Loader2 className="size-4 animate-spin mr-1.5" /> : null}
            Checkout
          </Button>
        </section>
      </div>
    </div>
  )
}
export default CartPage
