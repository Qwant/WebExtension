import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
	.use(XHR)
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		backend: {
			loadPath: "/_locales/{{lng}}/{{ns}}.json"
		},
		react: {
			useSuspense: false
		},
		ns: ['messages'],
		defaultNS: 'home',
		fallbackLng: "fr",
		debug: false,
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;
