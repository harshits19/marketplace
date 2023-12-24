import { initTRPC } from "@trpc/server"
import { ExpressContext } from "../server"

const t = initTRPC.context<ExpressContext>().create()
export const router = t.router

// public access endpoint
export const publicProcedure = t.procedure
