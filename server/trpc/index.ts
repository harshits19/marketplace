import { z } from "zod"
import { authRouter } from "./auth-router"
import { publicProcedure, router } from "./trpc"
import { QueryValidator } from "../../lib/validators/query-validator"
import { getPayloadClient } from "../get-payload"

// for backend
export const appRouter = router({
  auth: authRouter,
  getInfiniteProducts: publicProcedure
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
})

export type AppRouter = typeof appRouter
