import { Access, CollectionConfig } from "payload/types"

const yourOwn: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true
  return {
    user: {
      equals: user?.id,
    },
  }
}

export const Wishlist: CollectionConfig = {
  slug: "wishlist",
  access: {
    read: () => true,
    create: yourOwn, //everyone
    update: yourOwn,
    delete: yourOwn,
  },
  admin: {
    hidden: () => false,
    useAsTitle: "user",
  },
  fields: [
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
}
