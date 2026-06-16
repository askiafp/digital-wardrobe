// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        wardrobe: "Wardrobe",
        styling: "Styling",
        planner: "Planner",
        analytics: "Insights",
        profile: "Profile"
      },
      header: {
        pieces: "pieces"
      }
    }
  },
  id: {
    translation: {
      nav: {
        home: "Beranda",
        wardrobe: "Lemari",
        styling: "Gaya",
        planner: "Rencana",
        analytics: "Analisis",
        profile: "Profil"
      },
      header: {
        pieces: "pakaian"
      }
    }
  }
};

i18n
  .use(LanguageDetector) // Otomatis mendeteksi bahasa browser user
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // Bahasa cadangan jika bahasa user tidak terdaftar
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;