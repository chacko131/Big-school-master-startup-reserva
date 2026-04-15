/**
 * Archivo: route.ts
 * Responsabilidad: Traducir texto en español a un idioma soportado desde un endpoint local.
 * Tipo: servicio
 */

import { NextResponse } from "next/server";
import { z } from "zod";

const TRANSLATE_ENDPOINT = "https://translate.googleapis.com/translate_a/single";

const translateRequestSchema = z.object({
  text: z.string().min(1),
  targetLanguage: z.enum(["en", "fr", "de", "it", "pt", "ja", "zh", "ko"]),
});

//-aqui empieza funcion getTranslatedText-//
/**
 * Extrae el texto traducido desde la respuesta de Google Translate.
 * @pure
 */
function getTranslatedText(payload: unknown, fallbackText: string): string {
  if (!Array.isArray(payload)) {
    return fallbackText;
  }

  const translatedSegments = payload[0];
  if (!Array.isArray(translatedSegments)) {
    return fallbackText;
  }

  const translatedText = translatedSegments
    .map((segment) => {
      if (!Array.isArray(segment)) {
        return "";
      }

      const firstPart = segment[0];
      return typeof firstPart === "string" ? firstPart : "";
    })
    .join("")
    .trim();

  return translatedText || fallbackText;
}
//-aqui termina funcion getTranslatedText-//

//-aqui empieza endpoint POST translate-//
/**
 * Traduce un texto validado usando Google Translate desde el servidor.
 * @sideEffect Realiza una petición saliente a Google Translate.
 */
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ translatedText: "" }, { status: 400 });
  }

  const parsedBody = translateRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ translatedText: "" }, { status: 400 });
  }

  const { text, targetLanguage } = parsedBody.data;
  const translationUrl = `${TRANSLATE_ENDPOINT}?client=gtx&sl=es&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(translationUrl, { method: "GET", cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ translatedText: text });
    }

    const payload: unknown = await response.json();
    const translatedText = getTranslatedText(payload, text);

    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json({ translatedText: text });
  }
}
//-aqui termina endpoint POST translate-//
