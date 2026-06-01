/**
 * Archivo: actions.ts
 * Responsabilidad: Enviar emails de contacto via Resend a info@fullhaus.es
 * Tipo: servidor
 */

"use server";

import { Resend } from "resend";
import { z } from "zod";

//-aqui empieza schema de validacion del formulario de contacto-//
const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  restaurant: z.string().optional(),
  email: z.string().email("Email inválido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});
//-aqui termina schema de validacion-//

//-aqui empieza tipo de estado del formulario-//
export type ContactFormState =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string> }
  | null;
//-aqui termina tipo de estado-//

//-aqui empieza funcion sendContactEmail y es para enviar el email de contacto via Resend-//
/**
 * Envía email de contacto a info@fullhaus.es usando Resend.
 * @sideEffect
 */
export async function sendContactEmail(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  //-aqui empieza validacion de variables de entorno-//
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return { success: false, error: "Servicio de email no configurado" };
  }
  //-aqui termina validacion de variables-//

  //-aqui empieza extraccion y validacion de datos del formulario-//
  const rawData = {
    name: formData.get("name")?.toString() ?? "",
    restaurant: formData.get("restaurant")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  };

  const validationResult = contactFormSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of validationResult.error.issues) {
      const field = issue.path[0]?.toString() ?? "form";
      fieldErrors[field] = issue.message;
    }
    return { success: false, error: "Datos inválidos", fieldErrors };
  }
  //-aqui termina validacion de datos-//

  const { name, restaurant, email, message } = validationResult.data;

  //-aqui empieza envio del email via Resend-//
  try {
    const resend = new Resend(resendApiKey);

    const subject = restaurant
      ? `Nuevo mensaje de ${name} - ${restaurant}`
      : `Nuevo mensaje de ${name}`;

    const htmlContent = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      ${restaurant ? `<p><strong>Restaurante:</strong> ${restaurant}</p>` : ""}
      <p><strong>Email:</strong> ${email}</p>
      <hr/>
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `;

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: "info@fullhaus.es",
      replyTo: email,
      subject,
      html: htmlContent,
    });

    if (error) {
      return { success: false, error: `Error al enviar: ${error.message}` };
    }

    return { success: true, message: "Mensaje enviado correctamente" };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Error desconocido";
    return { success: false, error: `Error al enviar: ${errorMessage}` };
  }
  //-aqui termina envio del email-//
}
//-aqui termina funcion sendContactEmail-//
