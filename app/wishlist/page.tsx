"use client"

import Container from "@/components/Container"
import ProductItem, { ProductPlaceholder } from "@/components/ProductItem"
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
            <p className="py-8 my-16 text-xl font-semibold">No items in wishlist!</p>
          )}
        </div>
      </section>
    </Container>
  )
}
export default WishlistPage
