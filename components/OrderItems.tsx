"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from "date-fns"
import { Order, Product } from "@/server/payload-types"
import { formatPrice } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/lib/config"

export const OrderItems = ({ order }: { order: Order }) => {
  const formatDate = format(new Date(order.updatedAt), "dd MMMM yyyy hh:mm a")
  const products = order.products as Product[]
  const orderTotal = products.reduce((total, product) => {
    return total + product.price
  }, 0)
  return (
    <div className="flex flex-col border rounded-lg border-muted">
      <div className="flex items-center justify-between flex-shrink-0 p-4 bg-muted/60">
        <div className="flex gap-x-4 sm:gap-x-16">
          <div className="text-xs">
            <div className="font-semibold uppercase">Ordered on</div>
            <div className="text-foreground/70">{formatDate}</div>
          </div>
          <div className="text-xs">
            <div className="font-semibold uppercase">Total Price</div>
            <div className="text-foreground/70">{formatPrice(orderTotal)}</div>
          </div>
        </div>
        <div className="flex flex-col text-xs truncate">
          <div className="font-semibold uppercase">OrderId</div>
          <div className="truncate text-foreground/70">{"#" + order.id}</div>
        </div>
      </div>
      <div className="divide-y divide-muted">
        {products.map((product) => (
          <ProductItems product={product} orderId={order.id} key={product.id} />
        ))}
      </div>
    </div>
  )
}

const ProductItems = ({ product, orderId }: { product: Product; orderId: string }) => {
  const router = useRouter()
  const { image } = product.images[0]
  const imgUrl = typeof image === "object" ? image.url : image
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
  const redirectToOwnedProduct = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    router.push(`/success?orderId=${orderId}`)
  }
  const redirectToListedProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    router.push(`/product/${product.id}`)
  }
  return (
    <div className="flex flex-col px-4 py-2 cursor-pointer gap-y-4 sm:flex-row" onClick={redirectToOwnedProduct}>
      <div className="flex flex-1 gap-x-4">
        <div className="relative size-20 sm:size-28 shrink-0">
          {imgUrl && <Image src={imgUrl} fill alt="product-image" className="object-cover rounded-sm" />}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-medium line-clamp-1 hover:underline text-primary">{product.name}</span>
          <span className="text-sm font-medium line-clamp-2">{product.description}</span>
          <span className="text-xs capitalize line-clamp-1 text-muted-foreground">{label}</span>
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <Button onClick={redirectToListedProduct} size="sm">
          Buy it again
        </Button>
        <Button onClick={redirectToOwnedProduct} size="sm" variant="outline">
          View your item
        </Button>
      </div>
    </div>
  )
}

export const OrderItemsShimmer = () => {
  return (
    <section className="w-full h-full mt-8 space-y-4">
      <div className="border rounded border-muted">
        <Skeleton className="w-full h-12 rounded-none" />
        <div className="flex flex-col p-4 gap-y-4 sm:grid sm:grid-cols-2">
          <Skeleton className="size-20 sm:size-28 shrink-0" />
          <div className="flex flex-col items-end gap-y-2">
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
          </div>
        </div>
      </div>
      <div className="border rounded border-muted">
        <Skeleton className="w-full h-12 rounded-none" />
        <div className="flex flex-col p-4 gap-y-4 sm:grid sm:grid-cols-2">
          <Skeleton className="size-20 sm:size-28 shrink-0" />
          <div className="flex flex-col items-end gap-y-2">
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
          </div>
        </div>
      </div>
      <div className="border rounded border-muted">
        <Skeleton className="w-full h-12 rounded-none" />
        <div className="flex flex-col p-4 gap-y-4 sm:grid sm:grid-cols-2">
          <Skeleton className="size-20 sm:size-28 shrink-0" />
          <div className="flex flex-col items-end gap-y-2">
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
            <Skeleton className="w-full sm:w-24 h-7 sm:h-8" />
          </div>
        </div>
      </div>
    </section>
  )
}
