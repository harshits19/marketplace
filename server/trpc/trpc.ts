import { TRPCError, initTRPC } from "@trpc/server"
import { ExpressContext } from "../server"
import { PayloadRequest } from "payload/types"
import { User } from "../payload-types"

const t = initTRPC.context<ExpressContext>().create()
export const router = t.router

// public access endpoint
export const publicProcedure = t.procedure

//if user is logged in, then create a middleware to pass user details as trpc context to each request on
const isAuth = t.middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest
  const { user } = req as { user: User | null }
  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({
    ctx: {
      user,
    },
  })
})

export const privateProcedure = t.procedure.use(isAuth)
