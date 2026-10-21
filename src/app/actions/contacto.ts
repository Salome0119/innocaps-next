"use server";

import { getPayload } from "payload";
import config from "../../../payload.config";

export type ContactoFormData = {
  via: "lab" | "bio" | "licensing";
  asunto: string;
  nombre: string;
  empresa: string;
  email: string;
  telefono?: string;
  sector: string;
  consulta: string;
};

export type ContactoActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

export async function submitContacto(formData: ContactoFormData): Promise<ContactoActionResult> {
  try {
    const payload = await getPayload({ config });

    await payload.create({
      collection: "contactos",
      data: {
        via: formData.via,
        asunto: formData.asunto,
        nombre: formData.nombre,
        empresa: formData.empresa,
        email: formData.email,
        telefono: formData.telefono || "",
        sector: formData.sector,
        consulta: formData.consulta,
        estado: "PENDIENTE",
      },
    });

    return { success: true, message: "Consulta enviada correctamente. Nuestro equipo la revisará pronto." };
  } catch (error) {
    console.error("Error al crear contacto en Payload:", error);
    return { success: false, error: "Error al enviar la consulta. Inténtalo de nuevo más tarde." };
  }
}