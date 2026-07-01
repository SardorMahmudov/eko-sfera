"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./resources";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "uz-cyrl",
    fallbackLng: "uz-cyrl",
    // i18next "uz-cyrl" ni "uz-Cyrl" ga normalizatsiya qiladi — resurs kalitlari
    // kichik harfda bo'lgani uchun barcha til kodlarini kichik harfga majburlaymiz.
    lowerCaseLng: true,
    supportedLngs: ["uz-cyrl", "uz-latn", "ru"],
    nonExplicitSupportedLngs: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
