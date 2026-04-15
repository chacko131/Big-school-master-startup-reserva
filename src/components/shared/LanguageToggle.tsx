/**
 * Archivo: LanguageToggle.tsx
 * Responsabilidad: Selector de idiomas con diseño minimalista y persistencia.
 * Tipo: UI
 */

"use client";

import React, { useState } from "react";
import { useLanguage, SupportedLanguage } from "@/lib/LanguageContext";

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
];

/**
 * Selector de idioma con efecto vidrio (glassmorphism).
 */
export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  //-aqui empieza funcion toggle-//
  const toggleDropdown = () => setIsOpen(!isOpen);
  //-aqui termina funcion toggle-//

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const isDarkSurface = true;

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all ${
          isDarkSurface
            ? "border-white/10 bg-black text-white hover:bg-white/5"
            : "border-black/6 bg-surface-container-lowest text-foreground hover:bg-surface-container-low"
        }`}
        aria-label="Seleccionar idioma"
      >
        <span>{currentLang.flag}</span>
        <span className="uppercase">{currentLang.code}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_40px_rgba(26,28,28,0.35)] animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-white/5 ${
                  language === lang.code ? "bg-white/5 text-white" : "text-white"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(197,235,212,0.55)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
