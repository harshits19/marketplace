import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import { Product } from "@/server/payload-types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "INR"
    notation?: Intl.NumberFormatOptions["notation"]
  } = {}
) {
  const { currency = "INR", notation = "standard" } = options

  const numericPrice = typeof price === "string" ? parseFloat(price) : price

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 0,
  }).format(numericPrice)
}

export function parseLabelsAndImgs(product: Product) {
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]
  return { label, validUrls }
}
