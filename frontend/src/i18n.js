import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import english from "./locals/en.json";
import italian from "./locals/it.json";

i18n.use(LanguageDetector).use(initReactI18next).init({
    debug:true,
    lng:"it",
    resources:{
        en:{
            translation:english
        },
        it:{
            translation:italian
        },
    },
    fallbackLng:"en"
})