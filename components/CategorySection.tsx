import Container from "@/components/Container"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import Image from "next/image"
import Link from "next/link"

const CategorySection = () => {
  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Shop by categories</h1>
      <section className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-4 md:gap-x-4 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {PRODUCT_CATEGORIES?.map((prod) => (
          <Link href={`/products?category=${prod.value}`} key={prod.value}>
            <div className="flex flex-col">
              <div className="relative h-full p-2 aspect-square bg-muted dark:bg-white/70 rounded-xl">
                <Image
                  src={prod.iconSrc}
                  alt="product-category"
                  className="object-cover object-center w-full h-full p-10"
                  sizes="100vw"
                  fill
                />
              </div>
              <span className="pt-2 text-sm text-center truncate">{prod.label}</span>
            </div>
          </Link>
        ))}
      </section>
    </Container>
  )
}
export default CategorySection
