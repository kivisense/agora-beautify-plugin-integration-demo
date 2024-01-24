import Vue from "vue";
import VueI18n from "vue-i18n";

import enLocale from "./en";
import zhLocale from "./zh";

Vue.use(VueI18n);

const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
};

function getLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const language = urlParams.get("lang") || "";

  if (/^zh/i.test(language)) {
    return "zh";
  }

  return "en";
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages,
  fallbackLocale: "en",
});

export default i18n;
