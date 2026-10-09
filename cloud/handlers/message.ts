import { type UpdateHandler } from 'sdk'
import startHandler from 'lib/handlers/start'
import getPendingRequestsHandler from 'lib/handlers/get_pending_requests'
import { BOT_USERNAME, DEBUG } from 'lib/constants'
import { cleanupPendingRequests } from 'lib/join_request'
import { getI18n, normalizeLanguageTag } from 'lib/locales'

const i18n = getI18n()

const handler: UpdateHandler<'message'> = async (message, ctx) => {
  if (message.text == '/start' || message.text == `/start@${BOT_USERNAME}`) {
    i18n.locale = normalizeLanguageTag(message.from?.language_code)
    await startHandler(message, {
      ...ctx,
      t: i18n.t.bind(i18n),
    })
  }
  if (DEBUG && message.text == '/get_pending_requests') {
    await getPendingRequestsHandler(message, ctx)
  }
  await cleanupPendingRequests()
}

export default handler
