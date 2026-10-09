import { type TranslateOptions, type Scope } from 'i18n-js'

type I18nContext = {
  t: <T = string>(scope: Scope, options?: TranslateOptions) => string | T
}

export type { I18nContext }
