<script lang="ts" setup>
import Turnstile from 'cfturnstile-vue3'
import { ref, watch } from 'vue'
import { useI18n } from 'petite-vue-i18n'
import { useUrlSearchParams } from '@vueuse/core'
import type { ServerlessError } from '../serverless'

const loginStatus = ref(0)
const errmsg = ref('')
const sitekey = import.meta.env.VITE_SITEKEY
const requestToken = useUrlSearchParams('hash-params').request_token

const webApp = window.Telegram.WebApp
const initData = window.Telegram.WebApp.initDataUnsafe
const serverless = window.Telegram.WebApp.Serverless
const mainButton = window.Telegram.WebApp.MainButton
const hapticFeedback = window.Telegram.WebApp.HapticFeedback

const { t, locale } = useI18n()

mainButton.setText(t('RESULTPAGE_BUTTON_DONE'))
mainButton.onClick(() => {
  webApp.close()
})

watch(loginStatus, (newStatus) => {
  const show = newStatus === 2 || newStatus === -2
  if (show) {
    mainButton.show()
  } else {
    mainButton.hide()
  }
})

if (initData.user) {
  loginStatus.value = 1
  const language = initData.user.language_code
  if (language) {
    locale.value = language.toLowerCase()
  }
} else {
  loginStatus.value = -1
}

function captchaVerify(token: string) {
  loginStatus.value = 3
  serverless.call(
    'verify',
    {
      token: token,
      request_token: requestToken,
      version: webApp.version,
      platform: webApp.platform,
    },
    function (error: ServerlessError) {
      if (error) {
        loginStatus.value = -2
        hapticFeedback.notificationOccurred('error')
        errmsg.value = t(`ERRCODE_${error.message}`) || t('ERRCODE_UNKNOWN')
        return
      }
      loginStatus.value = 2
      hapticFeedback.notificationOccurred('success')
    },
  )
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center">
    <img src="../assets/robot.webp" class="mt-12 h-26 w-26" />
    <template v-if="loginStatus === 0">
      <div class="description-text">{{ t('LOGIN_REMINDER') }}</div>
    </template>
    <template v-else-if="loginStatus === 1">
      <div class="header-text">{{ t('VERIFING_BANNER') }}</div>
      <div class="description-text">{{ t('VERIFING_SUBTITLE') }}</div>
      <div class="p-6">
        <turnstile :sitekey="sitekey" @callback="captchaVerify" />
      </div>
    </template>
    <template v-else-if="loginStatus === 2">
      <div class="header-text">{{ t('PASSED_TITLE') }}</div>
      <div class="description-text" v-html="t('PASSED_DESC')"></div>
    </template>
    <template v-else-if="loginStatus === 3">
      <div class="description-text">{{ t('PLEASEWAIT') }}</div>
    </template>
    <template v-else-if="loginStatus === -2">
      <div class="header-text">{{ t('ERROR_TITLE') }}</div>
      <div class="description-text" v-html="t('ERROR_DESC', { errmsg })"></div>
    </template>
    <div class="footer mt-auto">
      <p>Powered By</p>
      <p>
        <a class="footer-link" href="https://github.com/tehcneko/tg-watchdog-serverless" target="_blank"
          >TG Watchdog Serverless</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
@reference "tailwindcss";

.header-text {
  @apply mt-6 text-2xl font-bold;
  color: var(--tg-theme-text-color);
}

.description-text {
  @apply mt-3 text-lg;
  color: var(--tg-theme-hint-color);
}

.footer {
  @apply mb-3 flex flex-col items-center text-xs;
  color: var(--tg-theme-hint-color);
}

.footer-link {
  color: var(--tg-theme-link-color);
}
</style>
