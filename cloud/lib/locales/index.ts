import { I18n } from 'i18n-js'
import en from './en/messages.json'
import ja from './ja/messages.json'
import ru from './ru/messages.json'
import tr from './tr/messages.json'
import zhHans from './zh-Hans/messages.json'
import zhHant from './zh-Hant/messages.json'

export function getI18n(): I18n {
  return new I18n(
    {
      en,
      ja,
      ru,
      tr,
      'zh-hans': zhHans,
      'zh-hant': zhHant,
    },
    {
      defaultLocale: 'en',
    },
  )
}

export function normalizeLanguageTag(languageCode: string | undefined): string {
  if (!languageCode) {
    return 'en'
  }
  const normalized = languageCode.trim().replace(/_/g, '-').toLowerCase()
  const subtags = normalized.split('-')
  const language = subtags[0]
  if (language === 'zh') {
    if (
      subtags.includes('hant') ||
      subtags.includes('tw') ||
      subtags.includes('hk') ||
      subtags.includes('mo')
    ) {
      return 'zh-hant'
    }
    return 'zh-hans'
  }
  return normalized
}
