import { type UpdateHandler } from 'sdk'
import joinRequestHandler from 'lib/handlers/join_request'
import { cleanupPendingRequests } from 'lib/join_request'
import { getI18n, normalizeLanguageTag } from 'lib/locales'

const i18n = getI18n()

const handler: UpdateHandler<'chat_join_request'> = async (chatJoinRequest, ctx) => {
  i18n.locale = normalizeLanguageTag(chatJoinRequest.from.language_code)
  await joinRequestHandler(chatJoinRequest, {
    ...ctx,
    t: i18n.t.bind(i18n),
  })
  await cleanupPendingRequests()
}

export default handler
