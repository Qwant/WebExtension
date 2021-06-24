import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";

i18n
	.use(XHR)
	.use(initReactI18next)
	.init({
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json"
		},
		react: {
			useSuspense: false
		},
		ns: ['messages'],
		defaultNS: 'home',
		lng: "en",
		fallbackLng: "en",
		debug: false,
		interpolation: {
			escapeValue: false
		}
	});

export default i18n;
