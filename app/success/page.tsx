import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { Product, ProductFile, User } from "@/server/payload-types"
import { getPayloadClient } from "@/server/get-payload"
import { formatPrice } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import { useGetUser } from "@/hooks/useGetUser"
import PaymentStatus from "@/components/PaymentStatus"

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}
const SuccessPage = async ({ searchParams }: PageProps) => {
  const orderId = searchParams.orderId
  const nextCookies = cookies()
  const { user } = await useGetUser(nextCookies)
  const payload = await getPayloadClient()
  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  })
  const [order] = orders
  if (!order) return notFound()
  const orderUserId = typeof order.user === "string" ? order.user : order.user.id
  if (orderUserId !== user?.id) return redirect(`/sign-in?origin=success?orderId=${order.id}`)
  const products = order.products as Product[]
  const orderTotal = products.reduce((total, product) => {
    return total + product.price
  }, 0)

  return (
    <main className="lg:min-h-full">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <div className="relative hidden w-full overflow-hidden lg:flex h-3/4">
          <Image fill src="/popeye-greeting.png" className="object-contain" sizes="100vw" alt="thank you for your order" />
        </div>
        <div className="lg:col-start-2">
          <p className="text-sm font-medium text-primary">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Thanks for ordering</h1>
          {order._isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Your order was processed and your assets are available to download below.
              {/*   We&apos;ve sent your receipt and order details to{" "}
              {typeof order.user !== "string" ? <span className="font-medium">{order.user.email}</span> : null}. */}
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we&apos;re currently processing it. So hang tight and we&apos;ll send you
              confirmation very soon!
            </p>
          )}
          <div className="mt-4 text-sm font-medium">
            <div className="text-muted-foreground">Order number</div>
            <div className="mt-1">{order.id}</div>
            <ul className="mt-6 text-sm font-medium border-t divide-y divide-muted border-muted text-muted-foreground">
              {(order.products as Product[]).map((product) => {
                const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label
                const downloadUrl = (product.product_files as ProductFile).url as string
                const { image } = product.images[0]

                return (
                  <li key={product.id} className="flex py-6 space-x-6">
                    <div className="relative w-24 h-24">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          fill
                          src={image.url}
                          alt={`${product.name} image`}
                          className="flex-none object-cover object-center bg-gray-100 rounded-md"
                        />
                      ) : null}
                    </div>
                    <div className="flex flex-col justify-between flex-auto">
                      <div className="space-y-1">
                        <h3>{product.name}</h3>
                        <p className="my-1">Category: {label}</p>
                      </div>
                      {order._isPaid ? (
                        <a
                          href={downloadUrl}
                          download={product.name}
                          className="text-primary hover:underline underline-offset-2">
                          Download asset
                        </a>
                      ) : null}
                    </div>
                    <p className="flex-none font-medium">{formatPrice(product.price)}</p>
                  </li>
                )
              })}
            </ul>

            <div className="pt-6 space-y-6 text-sm font-medium border-t border-muted text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{formatPrice(orderTotal)}</p>
              </div>
              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p>{formatPrice(100)}</p>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-muted">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(orderTotal + 1)}</p>
              </div>
            </div>
            <PaymentStatus isPaid={order._isPaid} orderEmail={(order.user as User).email} orderId={order.id} />
            <div className="py-6 mt-16 text-right border-t border-muted">
              <Link href="/products" className="text-sm font-medium text-primary hover:text-primary/80">
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
export default SuccessPage
