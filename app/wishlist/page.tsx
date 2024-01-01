"use client"

import Container from "@/components/Container"
import ProductItem, { ProductPlaceholder } from "@/components/ProductItem"
import { Product } from "@/server/payload-types"
import { trpc } from "@/server/trpc/client"

const WishlistPage = () => {
  const { data, isLoading } = trpc.getInfiniteProducts.getWishList.useQuery()
  const wishlist = data?.docs[0]?.products?.map((prod) => prod) as Product[]
  return (
    <Container className="my-8 sm:my-20">
      <h1 className="text-2xl font-semibold sm:text-5xl ">Wishlist</h1>
      <section className="relative py-12">
        <div className="flex items-center w-full mt-6">
          <div className="grid w-full grid-cols-2 gap-4 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {isLoading && (
              <>
                <ProductPlaceholder />
                <ProductPlaceholder />
                <ProductPlaceholder />
                <ProductPlaceholder />
              </>
            )}
            {!isLoading && wishlist?.length > 0
              ? wishlist.map((product, idx) => <ProductItem product={product} key={idx} index={idx} />)
              : null}
          </div>
        </div>
        {!isLoading && wishlist?.length === 0 && (
          <p className="p-8 my-16 text-xl font-semibold text-center">No items in wishlist!</p>
        )}
      </section>
    </Container>
  )
}
export default WishlistPage
