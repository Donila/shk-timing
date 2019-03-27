import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  'en': {
    title: 'Tool for timing attacks in Stronghold Kingdoms'
  },
  'ru': {
    title: 'Приблуда для тайминга аттак в Stronghold Kingdoms'
  }
};

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'ru',
  messages,
});

export default i18n