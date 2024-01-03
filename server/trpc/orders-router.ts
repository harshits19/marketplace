import { z } from "zod"
import { privateProcedure, router } from "./trpc"
import { getPayloadClient } from "../get-payload"
import { TRPCError } from "@trpc/server"

export const ordersRouter = router({
  fetchAllOrdersbyUser: privateProcedure.input(z.string()).query(async ({ ctx, input }) => {
    //get current user details
    const sorted = input
    const { user } = ctx
    const payload = await getPayloadClient()
    //fetch all orders of current user
    const { docs: orders } = await payload.find({
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
      limit: 20,
      sort: sorted,
    })
    if (!orders.length) throw new TRPCError({ code: "NOT_FOUND" })
    return { orders }
  }),
})
