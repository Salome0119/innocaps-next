"use server";

import nodemailer from "nodemailer";

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

const VIA_LABELS: Record<string, string> = {
  lab: "InnoCaps Lab — I+D+i, formulación y caracterización",
  bio: "InnoCaps Bio & WiBio — ingredientes funcionales y suministro B2B",
  licensing: "Licensing y alianzas tecnológicas",
};

function crearTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("Faltan variables de entorno SMTP requeridas");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function generarHtmlEmail(data: ContactoFormData): string {
  const viaLabel = VIA_LABELS[data.via] || data.via;
  const telefono = data.telefono ? data.telefono : "No proporcionado";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nueva consulta B2B - Innocaps Lab</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <tr>
      <td style="background: linear-gradient(135deg, #0c1e2a 0%, #0f172a 100%); border: 1px solid #14b8a6; border-radius: 16px; padding: 40px;">
        
        <!-- Header -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 24px; border-bottom: 1px solid #14b8a633;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <span style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.4); border-radius: 9999px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: #14b8a6;">
                      <span style="display: inline-block; width: 8px; height: 8px; background: #14b8a6; border-radius: 50%;"></span>
                      Nueva consulta B2B
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Via de contacto -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.2em; color: #06b6d4;">Vía de contacto</p>
              <p style="margin: 0; font-size: 20px; font-weight: 300; letter-spacing: 0.02em; color: #f1f5f9;">${viaLabel}</p>
            </td>
          </tr>
        </table>

        <!-- Datos del prospecto -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: rgba(5, 30, 34, 0.6); border: 1px solid rgba(20, 184, 166, 0.2); border-radius: 12px; padding: 24px;">
          <tr>
            <td>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <!-- Nombre -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(20, 184, 166, 0.1);">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Nombre</p>
                    <p style="margin: 0; font-size: 15px; color: #f1f5f9;">${data.nombre}</p>
                  </td>
                </tr>
                <!-- Empresa -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(20, 184, 166, 0.1);">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Empresa</p>
                    <p style="margin: 0; font-size: 15px; color: #f1f5f9;">${data.empresa}</p>
                  </td>
                </tr>
                <!-- Email -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(20, 184, 166, 0.1);">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Email corporativo</p>
                    <p style="margin: 0; font-size: 15px; color: #f1f5f9;"><a href="mailto:${data.email}" style="color: #14b8a6; text-decoration: none;">${data.email}</a></p>
                  </td>
                </tr>
                <!-- Teléfono -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(20, 184, 166, 0.1);">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Teléfono</p>
                    <p style="margin: 0; font-size: 15px; color: #f1f5f9;">${telefono}</p>
                  </td>
                </tr>
                <!-- Sector -->
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid rgba(20, 184, 166, 0.1);">
                    <p style="margin: 0 0 4px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Sector industrial</p>
                    <p style="margin: 0; font-size: 15px; color: #f1f5f9;">${data.sector}</p>
                  </td>
                </tr>
                <!-- Consulta -->
                <tr>
                  <td style="padding: 12px 0 0 0;">
                    <p style="margin: 0 0 8px 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b;">Consulta</p>
                    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #cbd5e1; white-space: pre-wrap;">${data.consulta}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="padding-top: 24px; border-top: 1px solid rgba(20, 184, 166, 0.2);">
              <p style="margin: 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b; text-align: center;">
                INNOCAPS LAB · CONFIDENCIAL
              </p>
              <p style="margin: 8px 0 0 0; font-size: 11px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b; text-align: center;">
                Enviado desde el formulario de contacto B2B de innocapslab.com
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function generarTextoEmail(data: ContactoFormData): string {
  const viaLabel = VIA_LABELS[data.via] || data.via;
  const telefono = data.telefono ? data.telefono : "No proporcionado";

  return `
NUEVA CONSULTA B2B - INNOCAPS LAB
=====================================

Vía de contacto: ${viaLabel}

DATOS DEL PROSPECTO
-------------------
Nombre: ${data.nombre}
Empresa: ${data.empresa}
Email: ${data.email}
Teléfono: ${telefono}
Sector: ${data.sector}

CONSULTA
--------
${data.consulta}

---
INNOCAPS LAB · CONFIDENCIAL
Enviado desde el formulario de contacto B2B de innocapslab.com
  `.trim();
}

export async function submitContacto(formData: ContactoFormData): Promise<ContactoActionResult> {
  try {
    const transporter = crearTransporter();

    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const mailTo = process.env.MAIL_TO || process.env.SMTP_USER;

    const htmlContent = generarHtmlEmail(formData);
    const textContent = generarTextoEmail(formData);

    const asunto = `Nueva consulta B2B: ${formData.asunto} - ${formData.empresa}`;

    await transporter.sendMail({
      from: `"Innocaps Lab Contacto" <${mailFrom}>`,
      to: mailTo,
      replyTo: formData.email,
      subject: asunto,
      text: textContent,
      html: htmlContent,
    });

    return { success: true, message: "Consulta enviada correctamente. Nuestro equipo la revisará pronto." };
  } catch (error) {
    console.error("Error al enviar email SMTP:", error);
    return { success: false, error: "Error al enviar la consulta. Inténtalo de nuevo más tarde." };
  }
}