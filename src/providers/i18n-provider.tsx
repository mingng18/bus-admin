import polyglotI18nProvider from "ra-i18n-polyglot";
import { en } from "../i18n/en";
import { bm } from "../i18n/bm";

interface TranslationMessages {
  [key: string]: any;
}

const translations: TranslationMessages = { en, bm };

const i18nProvider = polyglotI18nProvider(
  (locale) => (translations[locale] ? translations[locale] : translations.en),
  "en", // default locale
  [
    { locale: "en", name: "English" },
    { locale: "bm", name: "Bahasa Melayu" },
  ]
);

export default i18nProvider;
