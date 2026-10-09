import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createI18n } from 'petite-vue-i18n'
import englishi18n from './locales/en/strings.json'
import simchinesei18n from './locales/zh-Hans/strings.json'
import tradchinesei18n from './locales/zh-Hant/strings.json'
import japi18n from './locales/ja/strings.json'
import tri18n from './locales/tr/strings.json'
import rui18n from './locales/ru/strings.json'

const app = createApp(App)

const i18n = createI18n({
  legacy: false,
  locale: navigator.language?.toLowerCase(),
  fallbackLocale: 'en',
  messages: {
    en: englishi18n,
    'zh-hans': simchinesei18n,
    zh: simchinesei18n,
    'zh-cn': simchinesei18n,
    'zh-hant': tradchinesei18n,
    'zh-hk': tradchinesei18n,
    'zh-tw': tradchinesei18n,
    'zh-mo': tradchinesei18n,
    ja: japi18n,
    ru: rui18n,
    tr: tri18n,
  },
})

app.use(i18n)

app.mount('#app')
