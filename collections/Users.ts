import { CollectionConfig } from "payload/types"

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
    read: () => true,
    create: () => true,
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
  ],
}
