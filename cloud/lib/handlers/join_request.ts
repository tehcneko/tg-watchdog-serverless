import { api, type InputRichMessage } from 'sdk'
import { signJwt } from 'lib/jwt'
import { BASE_URL, JWT_SECRET } from 'lib/constants'
import { insertPendingRequest, TTL, type PendingRequest } from 'lib/join_request'
import type { UpdateHandler } from '../../types/handler'
import type { I18nContext } from '../../types/i18n'

export const handler: UpdateHandler<'chat_join_request', I18nContext> = async (
  chatJoinRequest,
  ctx,
) => {
  const userId = chatJoinRequest.user_chat_id
  const chatId = chatJoinRequest.chat.id
  const queryId = chatJoinRequest.query_id
  if (queryId != undefined) {
    const url = await getWebAppUrl({
      chat_id: chatId,
      user_id: userId,
      query_id: queryId,
    })
    api.sendChatJoinRequestWebApp({
      chat_join_request_query_id: queryId,
      web_app_url: url,
    })
  } else {
    const chat = chatJoinRequest.chat
    const richMsgLoading: InputRichMessage<string> = {
      blocks: [
        {
          type: 'paragraph',
          text: `${ctx.t('verify_message', { groupname: chat.title })}`,
        },
        {
          type: 'paragraph',
          text: {
            type: 'bold',
            text: `${ctx.t('verify_info')}`,
          },
        },
        {
          type: 'buttons',
          buttons: [
            {
              text: ctx.t('verify_loading'),
              style: 'primary',
              disabled: {},
            },
          ],
        },
      ],
    }
    const msg = await api.sendRichMessage({
      chat_id: userId,
      rich_message: richMsgLoading,
    })
    const msgId = msg.message_id
    const url = await getWebAppUrl({
      chat_id: chatId,
      msg_id: msgId,
      user_id: userId,
    })
    const richMsg: InputRichMessage<string> = {
      blocks: [
        {
          type: 'paragraph',
          text: `${ctx.t('verify_message', { groupname: chat.title })}`,
        },
        {
          type: 'paragraph',
          text: {
            type: 'bold',
            text: `${ctx.t('verify_info')}`,
          },
        },
        {
          type: 'buttons',
          buttons: [
            {
              text: ctx.t('verify_btn'),
              style: 'primary',
              web_app: {
                url: url,
              },
            },
          ],
        },
      ],
    }
    await api.editMessageText({
      chat_id: userId,
      message_id: msgId,
      rich_message: richMsg,
    })
  }
}

async function getWebAppUrl(request: PendingRequest): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + TTL
  const claims = {
    request_id: await insertPendingRequest(request),
    exp: exp,
    nbf: now,
  }
  const token = signJwt(claims, JWT_SECRET)
  return `${BASE_URL}/#request_token=${token}`
}

export default handler
