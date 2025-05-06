import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          welcome: 'Welcome to Urban Issue Reporter',
          description: 'Report urban issues in your city with ease',
          login: 'Login',
          register: 'Register',
          reportProblem: 'Report a Problem',
          dashboard: 'Dashboard',
          settings: 'Settings',
          logout: 'Logout',
          language: 'Language',
          fullName: 'Full Name',
          phoneNumber: 'Phone Number',
          cin: 'CIN',
          region: 'Region',
          city: 'City',
          submit: 'Submit',
          cancel: 'Cancel',
          uploadImage: 'Upload Image',
          takePhoto: 'Take Photo',
          location: 'Location',
          problemType: 'Problem Type',
          date: 'Date',
          status: 'Status',
          priority: 'Priority'
        }
      },
      fr: {
        translation: {
          welcome: 'Bienvenue sur Urban Issue Reporter',
          description: 'Signalez facilement les problèmes urbains dans votre ville',
          login: 'Connexion',
          register: 'S\'inscrire',
          reportProblem: 'Signaler un Problème',
          dashboard: 'Tableau de Bord',
          settings: 'Paramètres',
          logout: 'Déconnexion',
          language: 'Langue',
          fullName: 'Nom Complet',
          phoneNumber: 'Numéro de Téléphone',
          cin: 'CIN',
          region: 'Région',
          city: 'Ville',
          submit: 'Soumettre',
          cancel: 'Annuler',
          uploadImage: 'Télécharger une Image',
          takePhoto: 'Prendre une Photo',
          location: 'Emplacement',
          problemType: 'Type de Problème',
          date: 'Date',
          status: 'Statut',
          priority: 'Priorité',
          password: 'Mot de passe',
        }
      },
      ar: {
        translation: {
          welcome: 'مرحباً بك في مراقب المشاكل الحضرية',
          description: 'أبلغ عن المشاكل الحضرية في مدينتك بسهولة',
          login: 'تسجيل الدخول',
          register: 'تسجيل',
          reportProblem: 'الإبلاغ عن مشكلة',
          dashboard: 'لوحة التحكم',
          settings: 'الإعدادات',
          logout: 'تسجيل الخروج',
          language: 'اللغة',
          fullName: 'الاسم الكامل',
          phoneNumber: 'رقم الهاتف',
          cin: 'رقم البطاقة الوطنية',
          region: 'المنطقة',
          city: 'المدينة',
          submit: 'إرسال',
          cancel: 'إلغاء',
          uploadImage: 'تحميل صورة',
          takePhoto: 'التقاط صورة',
          location: 'الموقع',
          problemType: 'نوع المشكلة',
          date: 'التاريخ',
          status: 'الحالة',
          priority: 'الأولوية',
          password: 'كلمة المرور',
        }
      }
    }
  });

export default i18n;