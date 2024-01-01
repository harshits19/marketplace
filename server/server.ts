import express from "express"
import path from "path"
import { parse } from "url"
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
    const parsedUrl = parse(req.url, true)
    const { query } = parsedUrl
    return nextApp.render(req, res, "/cart", query)
  })
  app.use("/cart", cartRouter)

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
      await nextBuild(path.join(__dirname, "../"))
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
