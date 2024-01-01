import { z } from "zod"
import { getPayloadClient } from "../get-payload"
import { privateProcedure, publicProcedure, router } from "./trpc"
import { QueryValidator } from "../../lib/validators/query-validator"

export const productsRouter = router({
  carouselData: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish() /* cursor points to last item in query(per page)*/,
        query: QueryValidator /* custom validator for query */,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input
      const { sort, limit, ...queryOptions } = query
      const page = cursor || 1
      const payload = await getPayloadClient()

      const parsedQueryOptions: Record<string, { equals: string }> = {}
      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptions[key] = { equals: value }
      })

      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptions,
        },
        sort,
        depth: 1,
        limit,
        page,
      })

      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      }
    }),
  modifyWishList: privateProcedure.input(z.object({ products: z.string() })).mutation(async ({ ctx, input }) => {
    //get current user details
    const { user } = ctx
    const { products } = input
    const productIds = JSON.parse(products) as string[]

    const payload = await getPayloadClient()
    await payload.update({
      collection: "wishlist",
      where: {
        user: {
          equals: user.id,
        },
      },
      data: {
        products: productIds.map((productId) => productId),
      },
    })
    return { sucess: true }
  }),
  getWishList: privateProcedure.query(async ({ ctx }) => {
    //get current user details
    const { user } = ctx
    const payload = await getPayloadClient()
    const userList = await payload.find({
      collection: "wishlist",
      where: {
        user: {
          equals: user.id,
        },
      },
      limit: 1,
      depth: 2,
    })
    return userList
  }),
})
