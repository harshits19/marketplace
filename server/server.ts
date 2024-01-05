import express from "express"
import path from "path"
import { IncomingMessage } from "http"
import bodyParser from "body-parser"
import nextBuild from "next/dist/build"
import { getPayloadClient } from "./get-payload"
import { nextApp, nextHandler } from "./next-utils"
import * as trpcExpress from "@trpc/server/adapters/express"
import { appRouter } from "./trpc"
import { inferAsyncReturnType } from "@trpc/server"
import { stripeWebhookHandler } from "./webhook"
import { PayloadRequest } from "payload/types"

//step1 - create an express server
const app = express()
const PORT = Number(process.env.PORT) || 3000

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
})

export type ExpressContext = inferAsyncReturnType<typeof createContext>
export type WebhookRequest = IncomingMessage & { rawBody: Buffer }

//step2 - define start() to start payload
const start = async () => {
  const webhookMiddleware = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer
    },
  })
  //webhook for successfull payment event on stripe (see webhook.ts)
  app.post("/api/webhooks/stripe", webhookMiddleware, stripeWebhookHandler)

  //start cms
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`)
      },
    },
  })

  //redirect user from cart to signin page if he's not signed-in
  const cartRouter = express.Router()
  cartRouter.use(payload.authenticate)
  cartRouter.get("/", (req, res) => {
    const request = req as PayloadRequest
    if (!request.user) return res.redirect("/sign-in?origin=cart")
    return nextApp.render(req, res, "/cart")
  })
  app.use("/cart", cartRouter)

  const signInRouter = express.Router()
  signInRouter.use(payload.authenticate)
  signInRouter.get("/", (req, res) => {
    const request = req as PayloadRequest
    //if user is logged in, then redirect him to homepage
    const origin = req.query.origin || ""
    if (request.user) return res.redirect(`/${origin}`)
    //else redirect to sign-in
    return nextApp.render(req, res, "/sign-in")
  })
  app.use("/sign-in", signInRouter)

  const signUpRouter = express.Router()
  signUpRouter.use(payload.authenticate)
  signUpRouter.get("/", (req, res) => {
    const request = req as PayloadRequest
    if (request.user) return res.redirect("/")
    return nextApp.render(req, res, "/sign-up")
  })
  app.use("/sign-up", signUpRouter)

  const wishlistRouter = express.Router()
  wishlistRouter.use(payload.authenticate)
  wishlistRouter.get("/", (req, res) => {
    const request = req as PayloadRequest
    if (!request.user) return res.redirect("/sign-in?origin=wishlist")
    return nextApp.render(req, res, "/wishlist")
  })
  app.use("/wishlist", wishlistRouter)

  const ordersRouter = express.Router()
  ordersRouter.use(payload.authenticate)
  ordersRouter.get("/", (req, res) => {
    const request = req as PayloadRequest
    if (!request.user) return res.redirect("/sign-in?origin=orders")
    return nextApp.render(req, res, "/orders")
  })
  app.use("/orders", ordersRouter)

  //trpc middleware
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  )

  //next-app middleware for prod deployment
  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info("Next.js is building for production")
      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../../"))
      process.exit()
    })
    return
  }

  app.use((req, res) => nextHandler(req, res))
  nextApp.prepare().then(() => {
    payload.logger.info("Nextjs started")
    app.listen(PORT, async () => {
      payload.logger.info(`Nextjs App URL ${process.env.NEXT_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
