import { PRODUCT_CATEGORIES } from "@/lib/config"
import { getPayloadClient } from "@/server/get-payload"
import { notFound } from "next/navigation"

export const useGetProduct = async (productId: string) => {
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
  })
  const [product] = products
  if (!product) return notFound()
  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
  const validUrls = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]
  return { product, label, validUrls }
}
