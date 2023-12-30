import Link from "next/link"
import Container from "@/components/Container"
import CartButton from "@/components/CartButton"
import ImageSlider from "@/components/ImageSlider"
import ProductsCarousel from "@/components/ProductsCarousel"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Check, Shield } from "lucide-react"
import { useGetProduct } from "@/hooks/useGetProduct"

interface ProductPageProps {
  params: { productId: string }
}

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
]

const ProductPage = async ({ params: { productId } }: ProductPageProps) => {
  const { product, label, validUrls } = await useGetProduct(productId)
  return (
    <Container>
      <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
        <div className="lg:max-w-lg lg:self-end">
          <ol className="flex items-center">
            {BREADCRUMBS.map((breadcrumb, idx) => (
              <li className="flex items-center text-sm" key={breadcrumb.id}>
                <Link
                  href={breadcrumb.href}
                  className="text-sm font-medium text-muted-foreground hover:text-muted-foreground/80">
                  {breadcrumb.name}
                </Link>
                {idx !== BREADCRUMBS.length - 1 && (
                  <Separator orientation="vertical" className="h-5 rotate-[20deg] mx-3" />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          </div>
          <section className="mt-4">
            <div className="flex items-center">
              <p className="font-medium">{formatPrice(product.price)}</p>
              <Separator orientation="vertical" className="h-5 mx-4" />
              <div className="text-muted-foreground">{label}</div>
            </div>
            <div className="mt-4 space-y-6">
              <p className="text-base text-muted-foreground">{product.description}</p>
            </div>
            <div className="flex items-center mt-6">
              <Check aria-hidden className="flex-shrink-0 w-5 h-5 text-primary" />
              <p className="ml-2 text-sm text-muted-foreground">Eligible for instant delivery</p>
            </div>
          </section>
        </div>
        <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center group/main">
          <div className="rounded-lg aspect-square">
            <ImageSlider urls={validUrls} linkURL="" />
          </div>
        </div>
        <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
          <div>
            <div className="mt-10">
              <CartButton product={product} />
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex text-sm font-medium group">
                <Shield className="flex-shrink-0 mr-2 size-5 text-muted-foreground/50" />
                <span className="text-muted-foreground hover:text-muted-foreground/80">30 day Return Gurantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductsCarousel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like ${product.name}`}
      />
    </Container>
  )
}
export default ProductPage
