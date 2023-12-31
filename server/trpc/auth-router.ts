import { TRPCError } from "@trpc/server"
import { getPayloadClient } from "../get-payload"
import { publicProcedure, router } from "./trpc"
import { AuthCredentialsValidator } from "../../lib/validators/auth-validator"

export const authRouter = router({
  createPayloadUser: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input }) => {
    const { username, email, password } = input
    const payload = await getPayloadClient()

    //check user
    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    })
    if (users.length !== 0) throw new TRPCError({ code: "CONFLICT" })

    const user = await payload.create({
      collection: "users",
      data: {
        username,
        email,
        password,
        role: "user",
      },
    })
    await payload.create({
      collection: "wishlist",
      data: {
        user: user.id,
        products: [],
      },
    })

    return { success: true, sentToEmail: email }
  }),

  signIn: publicProcedure.input(AuthCredentialsValidator).mutation(async ({ input, ctx }) => {
    const { email, password } = input
    const { res } = ctx
    const payload = await getPayloadClient()
    try {
      await payload.login({
        collection: "users",
        data: {
          email,
          password,
        },
        res,
      })
      return { success: true }
    } catch (err) {
      throw new TRPCError({ code: "UNAUTHORIZED" })
    }
  }),
})
