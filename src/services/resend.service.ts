/**
 * Archivo: resend.service.ts
 * Responsabilidad: Encapsular el cliente de Resend para envío de emails transaccionales.
 * Tipo: servicio
 */

import { Resend } from "resend";

//-aqui empieza funcion getResendClient y es para obtener el cliente Resend con la API key del entorno-//
/**
 * Devuelve una instancia del cliente Resend.
 * Lanza si RESEND_API_KEY no está definida.
 * @sideEffect
 */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está definida en las variables de entorno");
  }
  return new Resend(apiKey);
}
//-aqui termina funcion getResendClient-//

export interface SendInvitationEmailParams {
  toEmail: string;
  restaurantName: string;
  inviterName: string;
  roleLabel: string;
  acceptUrl: string;
}

//-aqui empieza funcion sendInvitationEmail y es para enviar el email de invitacion al equipo-//
/**
 * Envía el email de invitación al miembro usando Resend.
 * @sideEffect
 */
export async function sendInvitationEmail(params: SendInvitationEmailParams): Promise<void> {
  const resend = getResendClient();

  const { toEmail, restaurantName, inviterName, roleLabel, acceptUrl } = params;

  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL no está definida en las variables de entorno");
  }

  await resend.emails.send({
    from,
    to: toEmail,
    subject: `${inviterName} te invitó a unirte a ${restaurantName}`,
    html: buildInvitationEmailHtml({ restaurantName, inviterName, roleLabel, acceptUrl }),
  });
}
//-aqui termina funcion sendInvitationEmail-//

//-aqui empieza funcion buildInvitationEmailHtml y es para construir el cuerpo HTML del email de invitacion-//
/**
 * Genera el HTML del email de invitación.
 * @pure
 */
function buildInvitationEmailHtml(params: Omit<SendInvitationEmailParams, "toEmail">): string {
  const { restaurantName, inviterName, roleLabel, acceptUrl } = params;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#6366f1;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                Reserva Latina
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;font-weight:700;">
                Te han invitado a unirte a ${restaurantName}
              </h2>
              <p style="margin:0 0 24px;color:#52525b;font-size:15px;line-height:1.6;">
                <strong>${inviterName}</strong> te ha invitado a formar parte del equipo de
                <strong>${restaurantName}</strong> con el rol de <strong>${roleLabel}</strong>.
              </p>
              <p style="margin:0 0 32px;color:#52525b;font-size:15px;line-height:1.6;">
                Haz clic en el botón para aceptar la invitación. Este enlace es válido durante <strong>48 horas</strong>.
              </p>
              <a href="${acceptUrl}"
                 style="display:inline-block;background:#6366f1;color:#ffffff;font-size:15px;font-weight:700;
                        text-decoration:none;padding:14px 32px;border-radius:10px;">
                Aceptar invitación
              </a>
              <p style="margin:32px 0 0;color:#a1a1aa;font-size:13px;">
                Si no esperabas esta invitación puedes ignorar este correo.
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
//-aqui termina funcion buildInvitationEmailHtml-//
