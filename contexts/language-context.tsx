"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { translations, type Language } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Detectar idioma del sistema
const detectSystemLanguage = (): Language => {
  if (typeof window === "undefined") return "es"

  const browserLang = navigator.language || navigator.languages?.[0] || "es"

  // Si el idioma del navegador empieza con 'en', usar inglés, sino español
  return browserLang.toLowerCase().startsWith("en") ? "en" : "es"
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es")

  // Inicializar idioma al cargar
  useEffect(() => {
    const savedLanguage = localStorage.getItem("agenda-language") as Language
    const systemLanguage = detectSystemLanguage()

    // Usar idioma guardado o detectar del sistema
    const initialLanguage = savedLanguage || systemLanguage
    setLanguageState(initialLanguage)
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("agenda-language", lang)
  }

  // Función de traducción con interpolación de parámetros
  const t = (key: string, params?: Record<string, string | number>): any => {
    const keys = key.split(".")
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    // If the value is a string we may need to interpolate parameters
    if (typeof value === "string") {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (_match: string, paramKey: string) => {
          return params[paramKey]?.toString() || _match
        })
      }
      return value
    }

    // For arrays / objects just return them directly
    return value !== undefined ? value : key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
