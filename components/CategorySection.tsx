import Container from "@/components/Container"
import { PRODUCT_CATEGORIES } from "@/lib/config"
import Image from "next/image"
import Link from "next/link"

const CategorySection = () => {
  return (
    <Container className="py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Shop by categories</h1>
      <section className="mt-4 grid grid-cols-3 gap-x-2.5 gap-y-4 md:gap-x-4 py-4 sm:grid-cols-4 lg:grid-cols-6">
        {PRODUCT_CATEGORIES?.map((prod) => (
          <Link href={`/products?category=${prod.value}`} key={prod.value}>
            <div className="flex flex-col">
              <div className="relative flex items-center justify-center h-full aspect-square bg-muted rounded-xl">
                <Image
                  src={prod.iconSrc}
                  alt="product-category"
                  height={128}
                  width={128}
                  className="object-cover object-center p-9 h-full w-full sm:p-0 sm:h-20 sm:w-20 dark:invert"
                  sizes="100vw"
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
