import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "zh", "es", "fr"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
