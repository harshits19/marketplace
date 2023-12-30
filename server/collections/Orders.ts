import { Access, CollectionConfig } from "payload/types"

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true
  return {
    user: {
      equals: user?.id,
    },
  }
}

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "all orders",
  },
  access: {
    read: yourOwn, //only you (owner) can access the ordered files
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
    create: ({ req }) => req.user.role === "admin",
  },
  fields: [
    {
      name: "_isPaid",
      type: "checkbox",
      access: {
        read: ({ req }) => req.user.role === "admin", //only admin can see, its value is updated by stripe webhook upon confirmation of payment
        create: () => false,
        update: () => false,
      },
      admin: {
        hidden: true, //not shown in admin dashboard
      },
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: true,
    },
  ],
}
