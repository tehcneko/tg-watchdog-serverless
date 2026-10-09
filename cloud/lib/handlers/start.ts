import { api } from 'sdk'
import { BOT_USERNAME } from 'lib/constants'
import type { UpdateHandler } from '../../types/handler'
import type { I18nContext } from '../../types/i18n'

export const handler: UpdateHandler<'message', I18nContext> = async (message, ctx) => {
  await api.sendMessage({
    chat_id: message.chat.id,
    text: `${ctx.t('welcome_body')}`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: ctx.t('welcome_setmeasadmin'),
            url: `https://t.me/${BOT_USERNAME}?startgroup=start&admin=can_invite_users+invite_users`,
          },
        ],
      ],
    },
    parse_mode: 'HTML',
  })
}

export default handler
