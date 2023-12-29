import { Access, CollectionConfig } from "payload/types"

const adminsAndUser: Access = ({ req: { user } }) => {
  if (user.role === "admin") return true
  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    verify: false,
    /* {
      generateEmailHTML: ({ token }) => {
        return `<p>Please verify your <a href={${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}}>Click here</a></p>`
      },
    }, */
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: ({ req }) => req.user.role === "admin",
    delete: ({ req }) => req.user.role === "admin",
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
  },
  fields: [
    {
      name: "role",
      required: true,
      defaultValue: "user",
      //   admin: {
      //     condition: () => false,
      //   },
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product Files",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "product_files",
      hasMany: true,
    },
  ],
}
