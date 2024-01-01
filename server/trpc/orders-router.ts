import { z } from "zod"
import { privateProcedure, router } from "./trpc"
import { getPayloadClient } from "../get-payload"
import { TRPCError } from "@trpc/server"

export const ordersRouter = router({
  fetchAllOrdersbyUser: privateProcedure
    .input(
      z.object({
        cursor: z.number().nullish() /* cursor points to last item in query(per page)*/,
        sorted: z.string().optional(),
        limit: z.number().min(1).max(10).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      //get current user details
      const { sorted, limit, cursor } = input
      const page = cursor || 1
      const { user } = ctx
      const payload = await getPayloadClient()
      //fetch all orders of current user
      const {
        docs: orders,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "orders",
        where: {
          user: {
            equals: user.id,
          },
          _isPaid: {
            equals: true,
          },
        },
        depth: 2,
        sort: sorted,
        limit,
        page,
      })
      if (!orders.length) {
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      return { orders, nextPage: hasNextPage ? nextPage : null }
    }),
})
