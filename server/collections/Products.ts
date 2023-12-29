import { PRODUCT_CATEGORIES } from "../../lib/config"
import { Product, User } from "../payload-types"
import { stripe } from "../../lib/stripe"
import { AfterChangeHook, BeforeChangeHook } from "payload/dist/collections/config/types"
import { Access, CollectionConfig } from "payload/types"

const addUser: BeforeChangeHook<Product> = async ({ req, data }) => {
  const user = req.user
  return { ...data, user: user.id }
}

const syncUser: AfterChangeHook<Product> = async ({ req, doc }) => {
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  })
  if (fullUser && typeof fullUser === "object") {
    const { products } = fullUser
    const allIDs = [...(products?.map((product) => (typeof product === "object" ? product.id : product)) || [])]
    const createdProductIDs = allIDs.filter((id, index) => allIDs.indexOf(id) === index)
    const dataToUpdate = [...createdProductIDs, doc.id]

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    })
  }
}
const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined
    if (!user) return false
    if (user.role === "admin") return true
    const userProductIDs = (user.products || []).reduce<Array<string>>((acc, product) => {
      if (!product) return acc
      if (typeof product === "string") {
        acc.push(product)
      } else {
        acc.push(product.id)
      }
      return acc
    }, [])
    return {
      id: {
        in: userProductIDs,
      },
    }
  }

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAdminOrHasAccess(),
    update: isAdminOrHasAccess(),
    delete: isAdminOrHasAccess(),
  },
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {
          const data = args.data as Product
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "INR",
              unit_amount: Math.round(data.price * 100),
            },
          })
          const updated: Product = {
            ...data,
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          }
          return updated
        } else if (args.operation === "update") {
          const data = args.data as Product
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          })
          const updated: Product = {
            ...data,
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          }
          return updated
        }
      },
    ],
  },
  fields: [
    {
      name: "user" /* a product is associated with one user */,
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name" /* product name */,
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Product details",
      type: "textarea",
    },
    {
      name: "price",
      label: "Price in INR",
      type: "number",
      min: 0,
      max: 100000,
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product Files",
      type: "relationship",
      relationTo: "product_files",
      hasMany: false,
      required: true,
    },
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Approved", value: "approved" },
        { label: "Denied", value: "denied" },
      ],
      access: {
        //only admins can change status
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
    },
    {
      name: "priceId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: false,
      },
    },
    {
      name: "stripeId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: false,
      },
    },
    {
      name: "images",
      label: "Product images",
      type: "array",
      minRows: 1,
      maxRows: 4, //max 4 images supported
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
}
