import express from "express"
import { WebhookRequest } from "./server"
import { stripe } from "../lib/stripe"
import type Stripe from "stripe"
import { getPayloadClient } from "./get-payload"

export const stripeWebhookHandler = async (req: express.Request, res: express.Response) => {
  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody
  const signature = req.headers["stripe-signature"] || ""

  let event
  try {
    //create a stripe event with key recieved from corresponding webhook created on stripe that will emit the event on successfull payment
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`)
  }

  // it's the metadata we passed to stripe (during payment session). see payment-router.ts
  const session = event.data.object as Stripe.Checkout.Session //we recieve session data from the stripe,

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    //if no orderId or userId is passed as metadata to the webhook
    return res.status(400).send(`Webhook Error: No user present in metadata`)
  }
  //
  if (event.type === "checkout.session.completed") {
    //if event is successfull
    const payload = await getPayloadClient()
    //find user by getting userId from metadata
    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        id: {
          equals: session.metadata.userId,
        },
      },
    })

    const [user] = users

    if (!user) return res.status(404).json({ error: "No such user exists." })

    /* const { docs: orders } = await payload.find({
      collection: "orders",
      depth: 2,
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    const [order] = orders */

    if (!user) return res.status(404).json({ error: "No such order exists." })

    //find corresponding order from orderId passed in metadata and update its payment status to paid
    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    })

    // send receipt
    /* try {
      const data = await resend.emails.send({
        from: "Digital MarketPlace <jai191912101@gmail.com>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.products as Product[],
        }),
      })
      res.status(200).json({ data })
    } catch (error) {
      res.status(500).json({ error })
    } */
  }

  return res.status(200).send()
}
