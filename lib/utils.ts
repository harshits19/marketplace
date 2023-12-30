import type { Metadata } from "next"
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

export function constructMetadata({
  title = "MarketPlace",
  description = "MarketPlace is an ecommerce platform for high-quality digital assets and services.",
  image = "/thumbnail.png",
  icons = "/icon.png",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@harshitgaur14",
    },
    icons,
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_SERVER_URL}`),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
