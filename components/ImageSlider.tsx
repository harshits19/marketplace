"use client"
import Image from "next/image"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselDot,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const ImageSlider = ({ urls, linkURL }: { urls: string[]; linkURL?: string }) => {
  const Content = (
    <CarouselContent className="w-full h-full p-0 m-0">
      {urls.map((url, idx) => {
        return (
          <CarouselItem className="relative w-full h-full overflow-clip aspect-square" key={idx}>
            <Image src={url} fill alt="product images" className="object-cover object-center" sizes="100vw"/>
          </CarouselItem>
        )
      })}
    </CarouselContent>
  )
  return (
    <Carousel className="relative w-full" opts={{ containScroll: false }}>
      {linkURL ? <Link href={`/product/${linkURL}`}>{Content}</Link> : Content}
      <CarouselPrevious className="z-50 hidden transition-opacity duration-100 opacity-0 md:inline-flex group-hover/main:opacity-80" />
      <CarouselNext className="z-50 hidden transition-opacity duration-100 opacity-0 md:inline-flex group-hover/main:opacity-80" />
      <div className="absolute flex -translate-x-1/2 bottom-2 left-1/2">
        {urls.map((_, index) => (
          <CarouselDot index={index} key={index} />
        ))}
      </div>
    </Carousel>
  )
}
export default ImageSlider
