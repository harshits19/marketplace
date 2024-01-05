"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
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

const SigninPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isSeller = searchParams.get("as")
  const origin = searchParams.get("origin")

  const continueAsSeller = () => {
    router.push("?as=seller")
  }
  const continueAsBuyer = () => {
    router.replace("/sign-in", undefined)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({ resolver: zodResolver(AuthCredentialsValidator) })

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error("Invalid email or password")
        return
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message)
        return
      }

      toast.error("Something went wrong. Please try again.")
    },
    onSuccess: () => {
      toast.success(`Signed in successfully`)
      if (isSeller) {
        router.push("/sell")
        return
      } else if (origin) {
        router.push(`/${origin}`)
        router.refresh()
        return
      } else {
        router.push("/")
        router.refresh()
      }
    },
  })

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password })
  }

  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0 mb-20">
      <div className="flex mx-auto w-full flex-col justify-center space-y-6 sm:w-[350px] ">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logo className="size-20" />
          <h1 className="text-2xl font-bold">Sign in to your {isSeller && "seller "}account</h1>
          <Link href="/sign-up" className={buttonVariants({ variant: "link", className: "gap-1.5" })}>
            Don&apos;t have an account? Sign-up
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
                Sign-in
              </Button>
            </div>
          </form>
          <div className="relative">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-background text-muted-foreground">or</span>
            </div>
          </div>
          {isSeller ? (
            <Button onClick={continueAsBuyer} variant="secondary" disabled={isLoading}>
              Continue as customer
            </Button>
          ) : (
            <Button onClick={continueAsSeller} variant="secondary" disabled={isLoading}>
              Continue as seller
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
export default SigninPage
