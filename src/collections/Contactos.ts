import type { CollectionConfig } from "payload";

export const Contactos: CollectionConfig = {
  slug: "contactos",
  admin: {
    useAsTitle: "asunto",
    group: "Contacto",
    defaultColumns: ["via", "asunto", "nombre", "empresa", "email", "estado", "createdAt"],
  },
  fields: [
    {
      name: "via",
      type: "text",
      required: true,
      admin: {
        description: "Vía de contacto: Lab, Bio o Licensing",
      },
    },
    {
      name: "asunto",
      type: "text",
      required: true,
    },
    {
      name: "nombre",
      type: "text",
      required: true,
    },
    {
      name: "empresa",
      type: "text",
      required: true,
    },
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "telefono",
      type: "text",
    },
    {
      name: "sector",
      type: "text",
      required: true,
    },
    {
      name: "consulta",
      type: "textarea",
      required: true,
    },
    {
      name: "estado",
      type: "select",
      required: true,
      defaultValue: "PENDIENTE",
      options: [
        { label: "Pendiente", value: "PENDIENTE" },
        { label: "En Revisión", value: "EN_REVISION" },
        { label: "Atendido", value: "ATENDIDO" },
      ],
      admin: {
        position: "sidebar",
      },
    },
  ],
};