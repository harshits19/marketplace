import { User } from "../payload-types"
import { Access, CollectionConfig } from "payload/types"

const isAdminOrhasAccesstoImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User | undefined
    if (!user) return false
    if (user.role === "admin") return true
    return {
      user: {
        equals: req.user.id,
      },
    }
  }

export const Media: CollectionConfig = {
  slug: "media",
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user.id } // association media with its seller(of product)
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      // frontend users should be able to see all images
      const referrer = req.headers.referer
      //to identify this media is accessed on frontend and not cms
      if (!req.user || !referrer?.includes("sell")) {
        return true
      }
      return await isAdminOrhasAccesstoImages()({ req })
    },
    delete: isAdminOrhasAccesstoImages(),
    update: isAdminOrhasAccesstoImages(),
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin", // only visible in admin dashboard,hidden to sellers,
  },
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 768, position: "centre" },
      { name: "tablet", width: 1024, height: undefined, position: "centre" },
    ],
    mimeTypes: ["image/*"], // only image types
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false, //dont show owner of media in cms except admin
      },
    },
  ],
}
