"use client"

import Link from "next/link"
import Container from "@/components/Container"
import ProductItem, { ProductPlaceholder } from "@/components/ProductItem"
import { buttonVariants } from "@/components/ui/button"
import { Product } from "@/server/payload-types"
import { trpc } from "@/server/trpc/client"

const WishlistPage = () => {
  const { data, isLoading } = trpc.getInfiniteProducts.getWishList.useQuery(undefined, { retry: false })
  const wishlist = data?.docs[0]?.products?.map((prod) => prod) as Product[]
  return (
    <Container className="my-8 sm:my-20">
      <h1 className="text-2xl font-semibold sm:text-5xl ">Wishlist</h1>
      <section className="relative py-12">
        <div className="flex items-center justify-center w-full mt-6">
          {isLoading ? (
            <div className="grid w-full grid-cols-2 gap-4 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
              <ProductPlaceholder />
              <ProductPlaceholder />
              <ProductPlaceholder />
              <ProductPlaceholder />
            </div>
          ) : wishlist?.length > 0 ? (
            <div className="grid w-full grid-cols-2 gap-4 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
              {wishlist?.map((product, idx) => (
                <ProductItem product={product} key={idx} index={idx} />
              ))}
            </div>
          ) : (
            <div className="p-8 my-16 md:my-32 flex justify-center items-center text-sm">
              Discover and wishlist new products{" "}
              <Link href="/products" className={buttonVariants({ variant: "link", className: "pl-1 pr-0" })}>
                click here
              </Link>
              .
            </div>
          )}
        </div>
      </section>
    </Container>
  )
}
export default WishlistPage
