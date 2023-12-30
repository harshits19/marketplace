"use client"
import ProductItem from "@/components/ProductItem"
import { TQueryValidator } from "@/lib/validators/query-validator"
import { Product } from "@/server/payload-types"
import { trpc } from "@/server/trpc/client"
import Link from "next/link"

interface ProductsCarouselProps {
  title: string
  subtitle?: string
  href?: string
  query: TQueryValidator
}

const FALLBACK_LIMIT = 4

const ProductsCarousel = ({ title, subtitle, href, query }: ProductsCarouselProps) => {
  const { data, isLoading } = trpc.getInfiniteProducts.carouselData.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )
  const products = data?.pages.flatMap((page) => page.items)
  let mappedProducts: (Product | null)[] = []
  if (products && products.length) {
    mappedProducts = products
  } else if (isLoading) {
    mappedProducts = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
  }

  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl lg:max-w-4xl">
          {title && <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="hidden text-sm font-medium text-primary hover:text-primary/85 hover:underline md:block">
            Shop the collection <span aria-hidden>&rarr;</span>
          </Link>
        )}
      </div>
      <div className="relative">
        <div className="flex items-center w-full mt-6">
          <div className="grid w-full grid-cols-2 gap-4 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {mappedProducts.map((product, idx) => (
              <ProductItem product={product} key={idx} index={idx} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default ProductsCarousel
