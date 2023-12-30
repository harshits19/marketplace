import { User } from "../payload-types"
import { BeforeChangeHook } from "payload/dist/collections/config/types"
import { Access, CollectionConfig } from "payload/types"

const addUser: BeforeChangeHook = ({ req, data }) => {
  //adding userId(of seller) of product file
  const user = req.user as User | null
  return { ...data, user: user?.id }
}

const yourOwnAndPurchased: Access = async ({ req }) => {
  //only seller who listed this product or buyer(owner) of this product can access it
  const user = req.user as User | null //checking if the user requested the prod file is seller or owner
  if (!user) return false
  if (user?.role === "admin") return true //admins can access

  //fetching all products(listed to sell) of this requesting user(user who requested the access of this product-file)
  const { docs: products } = await req.payload.find({
    collection: "products",
    depth: 0, //we dont want to populate fields such as images,product_files,user
    where: {
      user: {
        equals: user.id,
      },
    },
  })
  //extracting all product_file Ids
  const ownProductFileIds = products.map((prod) => prod.product_files).flat()

  //fetching all orders placed by this requesting user
  const { docs: orders } = await req.payload.find({
    collection: "orders",
    depth: 2, //populating other fields such as user and products(an order can contain multiple products)
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  //extracting all purchased product_files Ids
  const purchasedProductFileIds = orders
    .map((order) => {
      return order.products.map((product) => {
        if (typeof product === "string")
          return req.payload.logger.error("Search depth not sufficient to find purchased file IDs")

        return typeof product.product_files === "string" ? product.product_files : product.product_files.id
      })
    })
    .filter(Boolean)
    .flat()

  //if this product_file exist in any of owned or purchased arrays of user then grant access to file
  return {
    id: {
      in: [...ownProductFileIds, ...purchasedProductFileIds],
    },
  }
}

export const ProductFiles: CollectionConfig = {
  slug: "product_files",
  hooks: {
    beforeChange: [addUser],
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin", //this field will be only visible on admin dashboard
  },
  access: {
    read: yourOwnAndPurchased, //admin/sellers/buyer(owner) of this product can access it
    update: ({ req }) => req.user.role === "admin", //only admin
    delete: ({ req }) => req.user.role === "admin",
  },
  upload: {
    staticURL: "/product_files",
    staticDir: "product_files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        condition: () => false, //not shown in admin dashboard
      },
      required: true,
      hasMany: false,
    },
  ],
}
