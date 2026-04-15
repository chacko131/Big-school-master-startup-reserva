/**
 * Archivo: LanguageContext.tsx
 * Responsabilidad: Gestionar el estado del idioma global y proveer lógica de traducción dinámica.
 * Tipo: lógica / servicio
 */

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

//-aqui empieza tipos y constantes para i18n-//
export type SupportedLanguage = "es" | "en" | "fr" | "de" | "it" | "pt" | "ja" | "zh" | "ko";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LANGUAGES: Record<SupportedLanguage, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
};
//-aqui termina tipos y constantes-//

const translationCache = new Map<string, string>();
const pendingTranslations = new Map<string, Promise<string>>();

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Proveedor de contexto para el idioma.
 * @sideEffect Lee/Escribe en localStorage y realiza peticiones a la API de Google Translate.
 */
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>("es");
  const [pendingTranslationCount, setPendingTranslationCount] = useState(0);

  //-aqui empieza funcion de inicializacion-//
  // Recuperar idioma guardado al montar el componente
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") as SupportedLanguage;
    if (savedLang && LANGUAGES[savedLang]) {
      setLanguageState(savedLang);
    }
  }, []);
  //-aqui termina funcion de inicializacion-//

  /**
   * Cambia el idioma actual y persiste la elección.
   * @param lang Idioma seleccionado
   */
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("preferred-language", lang);
  };

  const isTranslating = pendingTranslationCount > 0;

  /**
   * Traduce un texto dinámicamente usando la API de Google Translate.
   * @param text Texto en español original
   * @returns Texto traducido
   * @pure (Excepto por la llamada de red y actualización de cache)
   */
  const t = useCallback(async (text: string): Promise<string> => {
    if (language === "es" || !text) return text;

    const cacheKey = `${language}:${text}`;
    const cachedTranslation = translationCache.get(cacheKey);
    if (cachedTranslation) return cachedTranslation;

    const pendingTranslation = pendingTranslations.get(cacheKey);
    if (pendingTranslation) return pendingTranslation;

    const translationPromise = (async () => {
      setPendingTranslationCount((current) => current + 1);

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLanguage: language }),
        });

        if (!response.ok) {
          translationCache.set(cacheKey, text);
          return text;
        }

        const data: unknown = await response.json();
        const translatedText =
          typeof data === "object" && data !== null && "translatedText" in data && typeof (data as { translatedText?: unknown }).translatedText === "string"
            ? (data as { translatedText: string }).translatedText
            : text;

        translationCache.set(cacheKey, translatedText);
        return translatedText;
      } catch {
        translationCache.set(cacheKey, text);
        return text;
      } finally {
        pendingTranslations.delete(cacheKey);
        setPendingTranslationCount((current) => Math.max(0, current - 1));
      }
    })();

    pendingTranslations.set(cacheKey, translationPromise);
    return translationPromise;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook para usar el contexto de idioma.
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage debe usarse dentro de un LanguageProvider");
  }
  return context;
};
