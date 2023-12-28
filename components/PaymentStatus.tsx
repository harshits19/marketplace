"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/server/trpc/client"

interface PaymentStatusProps {
  orderEmail: string
  orderId: string
  isPaid: boolean
}
const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter()
  const { data } = trpc.payment.paymentOrderStatus.useQuery(
    { orderId },
    { enabled: isPaid === false, refetchInterval: (data) => (data?.isPaid ? false : 1000) }
  )
  useEffect(() => {
    if (data?.isPaid) router.refresh()
  }, [data?.isPaid, router])

  return (
    <div className="grid grid-cols-2 mt-16 text-sm gap-x-4 text-muted-foreground/60">
      <div>
        <p className="font-medium">Shipping to</p>
        <p className="truncate">{orderEmail}</p>
      </div>
      <div>
        <p className="font-medium">Order status</p>
        <p className="">{isPaid ? "Payment successful" : "Pending payment"}</p>
      </div>
    </div>
  )
}
export default PaymentStatus
