"use client"

import Container from "@/components/Container"
import ProductItem from "@/components/ProductItem"
import { Product } from "@/server/payload-types"
import { trpc } from "@/server/trpc/client"

const WishlistPage = () => {
  const { mutate: wishlist } = trpc.getInfiniteProducts.modifyWishList.useMutation({})
  const { data } = trpc.getInfiniteProducts.getWishList.useQuery()
  console.log(data)
  /*  const { data, isLoading } = trpc.getInfiniteProducts.fetchWishlist.useQuery()
  const mappedProducts = data?.docs[0]?.wishlist?.map(({ product }) => product) as Product[] */
  return (
    <Container>
      <h2>My Wishlist</h2>
      <section className="relative py-12">
        <div className="flex items-center w-full mt-6">
          {/* <div className="grid w-full grid-cols-2 gap-4 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
            {isLoading ? (
              <div className="">Shimmer</div>
            ) : mappedProducts?.length > 0 ? (
              mappedProducts.map((product, idx) => <ProductItem product={product} key={idx} index={idx} />)
            ) : (
              <p className="p-8 my-16 text-xl font-semibold text-center">No items in wishlist!</p>
            )}
          </div> */}
        </div>
      </section>
    </Container>
  )
}
export default WishlistPage
