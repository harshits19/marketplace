"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { trpc } from "@/server/trpc/client"
import { cn } from "@/lib/utils"
import { Product } from "@/server/payload-types"

const WishlistButton = ({ product }: { product: Product }) => {
  const router = useRouter()
  const pathname = usePathname()
  const productId = product?.id
  const { mutate: modifyWishList } = trpc.getInfiniteProducts.modifyWishList.useMutation({})
  const { data } = trpc.getInfiniteProducts.getWishList.useQuery()
  const wishlist = data?.docs[0]?.products?.map((prod) => prod) as Product[]
  const wishlistIds = wishlist?.flatMap((prod) => prod.id)
  const isWishlisted = wishlistIds?.some((id) => id === productId)
  useEffect(() => {
    setIsClicked(isWishlisted || false)
  }, [isWishlisted])
  const [isClicked, setIsClicked] = useState(isWishlisted || false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    try {
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
    } catch (error) {
      router.push(`/sign-in?origin=${pathname.slice(1)}`)
      return
    }
  }

  return (
    <Button className={cn("w-full mt-4")} variant={isClicked ? "outline" : "secondary"} size="lg" onClick={handleClick}>
      {isClicked ? "Remove from wishlist" : "Add to wishlist"}
    </Button>
  )
}
export default WishlistButton
