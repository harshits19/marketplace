"use client"
import { useState } from "react"
import Link from "next/link"
import Container from "@/components/Container"
import { OrderItems, OrderItemsShimmer } from "@/components/OrderItems"
import { buttonVariants } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { trpc } from "@/server/trpc/client"
import { Order } from "@/server/payload-types"

const OrdersPage = () => {
  type SortType = "asc" | "-createdAt"
  const [sort, setSort] = useState<SortType>("-createdAt")
  const { data, isLoading } = trpc.getOrders.fetchAllOrdersbyUser.useQuery(sort, { retry: false })
  const orders = data?.orders as Order[]

  return (
    <Container className="max-w-5xl my-8 sm:my-20">
      <h1 className="text-2xl font-semibold sm:text-5xl">My Orders</h1>
      <section className="flex flex-col mt-8">
        <div className="flex items-center justify-end w-full gap-2 pb-4 border-b border-muted">
          <span className="font-medium">Sort by</span>
          <Select onValueChange={(value: SortType) => setSort(value)}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Latest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Latest</SelectItem>
              <SelectItem value="asc">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <OrderItemsShimmer />
        ) : orders?.length > 0 ? (
          <div className="flex flex-col mt-4 gap-y-4">
            {orders?.map((order: Order) => (
              <OrderItems order={order} key={order.id} />
            ))}
          </div>
        ) : (
          <div className="p-8 my-16 md:my-32 flex justify-center items-center text-sm">
            To order your first product{" "}
            <Link href="/products" className={buttonVariants({ variant: "link", className: "pl-1 pr-0" })}>
              click here
            </Link>
            .
          </div>
        )}
      </section>
    </Container>
  )
}
export default OrdersPage
