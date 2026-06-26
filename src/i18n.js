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
  },
  ja: {
    translation: {
      nav: {
        home: "ホーム",        // Hōmu
        wardrobe: "ワードローブ", // Wādorōbu
        styling: "スタイリング",  // Sutairingu
        planner: "プランナー",    // Purannā
        analytics: "インサイト",  // Insaito
        profile: "プロフィール"  // Purofīru
      },
      header: {
        pieces: "着"            // 'Chaku' 
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', 
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;