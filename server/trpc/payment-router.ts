import { z } from "zod"
import { privateProcedure, router } from "./trpc"
import { getPayloadClient } from "../get-payload"
import { TRPCError } from "@trpc/server"
import { stripe } from "../../lib/stripe"
import type Stripe from "stripe"

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //we will get productIds(were present in cart then processed to checkout) as input
      const { user } = ctx //see (trps.ts)
      let { productIds } = input
      if (productIds.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST" })
      }
      //fetching all product's details
      const payload = await getPayloadClient()
      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      })

      const filteredProducts = products.filter((prod) => Boolean(prod.priceId)) //filtering products with valid priceId

      //creating new order instance containing all filtered products
      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          products: filteredProducts.map((prod) => prod.id),
          user: user.id,
        },
      })

      //line-items is like a waiting list(cart) for items that have to be processed by stripe
      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []
      //pushing products in line items with their priceId as well as quantity
      filteredProducts.forEach((product) => {
        line_items.push({
          price: product.priceId!,
          quantity: 1,
        })
      })

      //pushing processing fees at last (generated in stripe dev)
      line_items.push({
        price: "price_1OSI2BSGElnarwkWRj5dr8tR",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      })

      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/success?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card"],
          currency: "INR",
          mode: "payment",
          metadata: {
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        })
        //passing metadata to use after processing payment(on success page)
        return { url: stripeSession.url } //used in cart page, to redirect to success page, when payment is success
      } catch (err) {
        console.log(err)
        return { url: null }
      }
    }),

  //to check whether the payment is succesfull or not (isPaid ? true : false)
  paymentOrderStatus: privateProcedure.input(z.object({ orderId: z.string() })).query(async ({ input }) => {
    const { orderId } = input //takes orderId as input and returns the isPaid value
    const payload = await getPayloadClient()
    const { docs: orders } = await payload.find({
      collection: "orders",
      where: {
        id: {
          equals: orderId,
        },
      },
    })
    if (!orders.length) {
      throw new TRPCError({ code: "NOT_FOUND" })
    }
    const [order] = orders
    return { isPaid: order._isPaid }
  }),
})
