"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { Product } from "@/server/payload-types"

const CartButton = ({ product }: { product: Product }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { addItem } = useCart()
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [isSuccess])
  return (
    <Button
      size="lg"
      className="w-full"
      onClick={() => {
        addItem(product)
        setIsSuccess(true)
      }}>
      {isSuccess ? "Added!" : "Add to Cart"}
    </Button>
  )
}
export default CartButton
