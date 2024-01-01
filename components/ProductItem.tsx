"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import ImageSlider from "@/components/ImageSlider"
import { Product } from "@/server/payload-types"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import { formatPrice } from "@/lib/utils"

interface ProductItemProps {
  product: Product | null
  index: number
}
const ProductItem = ({ product, index }: ProductItemProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)

    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label

  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]
  if (isVisible && product)
    return (
      <div className="flex flex-col w-full group/main">
        <ImageSlider urls={validUrls} linkURL={product.id} />
        <Link href={`/product/${product.id}`} className="contents">
          <h3 className="mt-2 text-sm font-medium">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
        </Link>
      </div>
    )
}

export const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden bg-muted aspect-square rounded-xl">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="w-2/3 h-4 mt-2 rounded-lg" />
      <Skeleton className="w-16 h-3 mt-1 rounded-lg" />
      <Skeleton className="w-12 h-3 mt-1 rounded-lg" />
    </div>
  )
}

export default ProductItem
