import type { CollectionConfig } from "payload";

export const Companies: CollectionConfig = {
  slug: "companies",
  admin: {
    useAsTitle: "name",
    group: "Administración",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "sector",
      type: "text",
      required: true,
    },
    {
      name: "users",
      type: "relationship",
      relationTo: "users",
      hasMany: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
};