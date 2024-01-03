export const PRODUCT_CATEGORIES = [
  {
    label: "Icons",
    value: "icons" as const, //converted to literal type
    iconSrc: "/categories/icon-icon.png",
    featured: [
      {
        name: "Favorite Icon Picks",
        href: `/products?category=icons`,
        imageSrc: "/nav/icons1.png",
      },
      {
        name: "New Arrivals",
        href: "/products?category=icons&sort=-createdAt",
        imageSrc: "/nav/icons2.png",
      },
      {
        name: "Bestselling Icons",
        href: "/products?category=icons",
        imageSrc: "/nav/icons3.png",
      },
    ],
  },
  {
    label: "UI Kits",
    value: "ui_kits" as const,
    iconSrc: "/categories/ui-kits-icon.png",
    featured: [
      {
        name: "Editor picks",
        href: `/products?category=ui_kits`,
        imageSrc: "/nav/uikit1.jpg",
      },
      {
        name: "New Arrivals",
        href: "/products?category=ui_kits&sort=-createdAt",
        imageSrc: "/nav/uikit2.jpg",
      },
      {
        name: "Bestsellers",
        href: "/products?category=ui_kits",
        imageSrc: "/nav/uikit3.jpg",
      },
    ],
  },
  {
    label: "Templates",
    value: "templates" as const,
    iconSrc: "/categories/template-icon.png",
    featured: [
      {
        name: "Editor picks",
        href: `/products?category=templates`,
        imageSrc: "/nav/template1.png",
      },
      {
        name: "New Arrivals",
        href: "/products?category=templates&sort=-createdAt",
        imageSrc: "/nav/template2.png",
      },
      {
        name: "Bestsellers",
        href: "/products?category=templates",
        imageSrc: "/nav/template3.png",
      },
    ],
  },
  {
    label: "Fonts",
    value: "fonts" as const,
    iconSrc: "/categories/font-icon.png",
  },
  {
    label: "Source Codes",
    value: "src_codes" as const,
    iconSrc: "/categories/source-code-icon.png",
  },
  {
    label: "Illustrations",
    value: "illustrations" as const,
    iconSrc: "/categories/theme-icon.png",
  },
]
