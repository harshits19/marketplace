"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Icons } from "@/components/Icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { ZodError } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { trpc } from "@/server/trpc/client"
import { AuthCredentialsValidator, TAuthCredentialsValidator } from "@/lib/validators/auth-validator"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const page = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({ resolver: zodResolver(AuthCredentialsValidator) })

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This email is already in use. Sign in instead?")
        return
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
        return
      }

      toast.error("Something went wrong. Please try again.")
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Profile Created. Login to continue`)
      router.push("/sign-in")
    },
  })

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    mutate({ email, password })
  }

  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="flex mx-auto w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="size-20" />
          <h1 className="text-2xl font-bold">Create an account</h1>
          <Link href="/sign-in" className={buttonVariants({ variant: "link", className: "gap-1.5" })}>
            Already have an account? Sign-in
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className={cn({ "focus-visible:ring-red-500": errors.email })}
                  {...register("email")}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  className={cn({ "focus-visible:ring-red-500": errors.password })}
                  {...register("password")}
                  placeholder="password"
                  type="password"
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>
              <Button className="mt-4" disabled={isLoading}>
                Sign-up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default page
