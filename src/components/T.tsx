/**
 * Archivo: T.tsx
 * Responsabilidad: Componente para renderizar textos con traducción automática dinámica.
 * Tipo: UI
 */

"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface TProps {
  children: string;
  className?: string;
}

/**
 * Componente T (Translate)
 * Envuelve un string en español y lo traduce al idioma seleccionado en el contexto.
 */
//-aqui empieza componente T-//
export const T: React.FC<TProps> = ({ children, className }) => {
  const { t, language } = useLanguage();
  const [translatedContent, setTranslatedContent] = useState<string>(children);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si el idioma es español, mostrar el texto original directamente
    if (language === "es") {
      setTranslatedContent(children);
      return;
    }

    let isMounted = true;
    
    //-aqui empieza funcion de traduccion interna-//
    const performTranslation = async () => {
      setIsLoading(true);
      const result = await t(children);
      if (isMounted) {
        setTranslatedContent(result);
        setIsLoading(false);
      }
    };
    //-aqui termina funcion de traduccion interna-//

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [children, language, t]);

  return (
    <span className={`${className} ${isLoading ? "opacity-50 animate-pulse" : "opacity-100"} transition-opacity duration-300`}>
      {translatedContent}
    </span>
  );
};
//-aqui termina componente T y se utiliza en cualquier lugar que requiera i18n-//
