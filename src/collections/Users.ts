import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Administración",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "COMPANY_USER",
      options: [
        { label: "Administrador", value: "ADMIN" },
        { label: "Usuario de Empresa", value: "COMPANY_USER" },
      ],
    },
  ],
};