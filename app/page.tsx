import Link from "next/link"
import Container from "@/components/Container"
import { Button, buttonVariants } from "@/components/ui/button"
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react"
import ProductsCarousel from "@/components/ProductsCarousel"

const perks = [
  {
    name: "Instant Delivery",
    Icon: ArrowDownToLine,
    description: "Get your assets delivered to your email in seconds and download them right away.",
  },
  {
    name: "Guaranteed Quality",
    Icon: CheckCircle,
    description:
      "Every asset on our platform is verified by our team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.",
  },
  {
    name: "For the Planet",
    Icon: Leaf,
    description: "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
  },
]

const HomePage = () => {
  return (
    <>
      <Container>
        <div className="flex flex-col items-center max-w-3xl py-20 mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Your marketplace for high-quality <span className="text-primary">digital assets</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to MarketPlace. Every asset on our platform is verified by our team to ensure our highest quality
            standards.
          </p>
          <div className="flex flex-col gap-4 mt-6 sm:flex-row">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our quality promise &rarr;</Button>
          </div>
        </div>
        <ProductsCarousel title="Brand New" href="/products" query={{ sort: "desc", limit: 4 }} />
      </Container>
      <section className="border-t border-muted-foreground/10 bg-muted/50">
        <Container className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div key={perk.name} className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
                <div className="flex justify-center md:flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full text-primary/90 bg-primary/20">
                    {<perk.Icon className="w-1/3 h-1/3" />}
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-card-foreground">{perk.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{perk.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
export default HomePage
