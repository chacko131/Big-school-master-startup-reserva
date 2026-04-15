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

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 rounded-full glass-container hover:bg-white/10 transition-all border border-white/20 text-sm font-medium"
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
        <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-container border border-white/20 overflow-hidden z-50 shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="py-1">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-white/10 transition-colors ${
                  language === lang.code ? "bg-white/10 text-primary-light" : "text-white/80"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {language === lang.code && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
