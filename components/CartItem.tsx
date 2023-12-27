"use client"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Product } from "@/server/payload-types"
import { useCart } from "@/hooks/useCart"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import { formatPrice } from "@/lib/utils"
import { Check, ImageIcon, X } from "lucide-react"

interface CartItemProps {
  product: Product
  variant: "slide" | "page"
}

const CartItem = ({ product, variant }: CartItemProps) => {
  const { image } = product.images[0]

  const { removeItem } = useCart()

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
  if (variant === "slide")
    return (
      <div className="py-2 space-y-3 border-b last:border-none border-muted">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 overflow-hidden rounded aspect-square min-w-fit">
              {typeof image !== "string" && image.url ? (
                <Image src={image.url} alt={product.name} fill className="absolute object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full bg-secondary">
                  <ImageIcon aria-hidden="true" className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex flex-col self-start">
              <span className="text-sm font-medium line-clamp-1">{product.name}</span>
              <span className="text-xs capitalize line-clamp-1 text-muted-foreground">{label}</span>
            </div>
          </div>
          <div className="flex flex-col items-center font-medium gap-y-1">
            <span className="text-sm line-clamp-1">{formatPrice(product.price)}</span>
            <button
              onClick={() => removeItem(product.id)}
              className="px-1.5 py-1 rounded-sm text-xs text-muted-foreground flex justify-center items-center gap-0.5 hover:bg-muted transition-colors duration-100">
              <X className="w-3 h-4" />
              Remove
            </button>
          </div>
        </div>
      </div>
    )
  else
    return (
      <div className="flex py-4">
        <div className="flex-shrink-0">
          <div className="relative w-24 h-24">
            {typeof image !== "string" && image.url ? (
              <Image
                fill
                src={image.url}
                alt="product image"
                className="object-cover object-center w-full h-full rounded-md sm:h-48 sm:w-48"
              />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col justify-between flex-1 ml-4 sm:ml-6">
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div>
              <h3 className="text-sm">
                <Link href={`/product/${product.id}`} className="font-medium">
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">Category: {label}</p>
              <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
            </div>
            <div className="w-20 mt-4 sm:mt-0 sm:pr-9">
              <div className="absolute top-0 right-0">
                <Button aria-label="remove product" onClick={() => removeItem(product.id)} variant="ghost">
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
          <p className="flex text-sm sm:mt-2">
            <Check className="flex-shrink-0 w-5 h-5 text-primary" />
            <span>Eligible for instant delivery</span>
          </p>
        </div>
      </div>
    )
}

export default CartItem
