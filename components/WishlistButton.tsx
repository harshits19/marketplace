"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { trpc } from "@/server/trpc/client"
import { cn } from "@/lib/utils"
import { Product } from "@/server/payload-types"

const WishlistButton = ({ product }: { product: Product }) => {
  const productId = product?.id
  const { mutate: modifyWishList } = trpc.getInfiniteProducts.modifyWishList.useMutation({})
  const { data } = trpc.getInfiniteProducts.getWishList.useQuery()
  console.log(data)
  const wishlist = data?.docs[0].products?.map((prod) => prod) as Product[] | undefined
  const wishlistIds = wishlist?.flatMap((prod) => prod.id)
  const isWishlisted = wishlistIds?.some((id) => id === productId)
  useEffect(() => {
    setIsClicked(isWishlisted || false)
  }, [isWishlisted])
  const [isClicked, setIsClicked] = useState(isWishlisted || false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (!wishlistIds) return
    if (isWishlisted) {
      setIsClicked(false)
      let response = wishlistIds.filter((id) => id !== productId)
      let productIds = JSON.stringify(response)
      modifyWishList({ products: productIds })
    } else {
      setIsClicked(true)
      let response = [...wishlistIds, productId]
      let productIds = JSON.stringify(response)
      modifyWishList({ products: productIds })
    }
  }

  return (
    <Button
      className={cn("w-full mt-4")}
      variant={isClicked ? "destructive" : "secondary"}
      size="lg"
      onClick={handleClick}>
      {isClicked ? "Remove from wishlist" : "Add to wishlist"}
    </Button>
  )
}
export default WishlistButton

/*
  const predicate = (prod: Product) => prod.id === product.id
   const [optimisticList, addOptimisticListItem] = useOptimistic<Product[]>(
    wishlist,
    // @ts-ignore
    (state: Product[], newproduct: Product) =>
      state.some(predicate) ? state.filter((prod) => prod.id !== product.id) : [...state, newproduct]
  )
  */
