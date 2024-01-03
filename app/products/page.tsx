import Container from "@/components/Container"
import ProductsCarousel from "@/components/ProductsCarousel"
import { PRODUCT_CATEGORIES } from "@/lib/config"

type Param = string | string[] | undefined

interface ProductsPageProps {
  searchParams: { [key: string]: Param }
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort)
  const category = parse(searchParams.category)

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label

  return (
    <Container>
      <ProductsCarousel
        title={label ?? "Browse high-quality assets"}
        query={{
          category,
          limit: 4,
          sort,
        }}
      />
    </Container>
  )
}

export default ProductsPage
