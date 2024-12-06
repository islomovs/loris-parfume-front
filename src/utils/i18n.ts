import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next"; // Only import necessary functions
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

const options: InitOptions = {
  fallbackLng: "uz",
  lng: "uz",
  supportedLngs: ["uz", "ru"], // Supported languages
  ns: ["common"], // Namespaces
  defaultNS: "common", // Default namespace
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json", // Path for loading translation files
  },
  react: {
    useSuspense: false,
  },
  detection: {
    order: ["cookie", "localStorage", "querystring", "navigator"], // Language detection order
    caches: ["cookie"], // Cache the language selection in cookies
  },
  // debug: true, // Enable debugging in development mode // to console log
};

i18n
  .use(HttpBackend) // Enables loading translations from backend
  .use(LanguageDetector) // Enables automatic language detection
  .use(initReactI18next) // Initializes react-i18next with i18next
  .init(options); // Initializes i18next with defined options

export default i18n;
