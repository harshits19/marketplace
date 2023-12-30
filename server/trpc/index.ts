import { authRouter } from "./auth-router"
import { router } from "./trpc"
import { paymentRouter } from "./payment-router"
import { productsRouter } from "./products-router"

// for backend
// after initializing trpc (in client.ts) creating diffrent routes(2nd file)
export const appRouter = router({
  auth: authRouter,
  payment: paymentRouter,
  getInfiniteProducts: productsRouter,
})

export type AppRouter = typeof appRouter
