import type { Update } from '@grammyjs/types'

export * from './api'
export * from './fetch'

export { db } from './db'
export { api, BotApiError } from './api'
export { fetch } from './fetch'

/**
 * Error used by an endpoint to return a client-visible error response.
 */
export declare class EndpointError extends Error {
  /** Additional JSON parameters returned to the Mini App. */
  readonly parameters?: Record<string, unknown>

  constructor(description: string, parameters?: Record<string, unknown>)
}

/**
 * Telegram Mini App user data included in verified endpoint init data.
 */
export interface EndpointInitDataUser {
  id: number
  first_name: string
  is_bot?: boolean
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  added_to_attachment_menu?: boolean
  allows_write_to_pm?: boolean
  photo_url?: string
}

/**
 * Telegram Mini App chat data included in verified endpoint init data.
 */
export interface EndpointInitDataChat {
  id: number
  type: string
  title?: string
  username?: string
  photo_url?: string
}

/**
 * Verified init data provided to an endpoint by the platform.
 */
export interface EndpointInitData {
  auth_date?: Date
  can_send_after?: number
  chat?: EndpointInitDataChat
  chat_instance?: string
  chat_type?: string
  hash?: string
  query_id?: string
  receiver?: EndpointInitDataUser
  start_param?: string
  user?: EndpointInitDataUser
  [key: string]: unknown
}

/**
 * Execution context passed as the second argument `ctx` to an endpoint.
 */
export interface EndpointContext {
  /** Mini App init data verified by the platform. */
  initData: EndpointInitData
}

/**
 * Type of an endpoint function. The input is the Mini App's JSON object.
 */
export type EndpointHandler<
  TInput extends Record<string, unknown> = Record<string, unknown>,
  TOutput = unknown,
> = (input: TInput, ctx: EndpointContext) => TOutput | Promise<TOutput>

/**
 * Execution context passed as the second argument `ctx` to an update handler.
 */
export interface HandlerContext {
  /**
   * The complete raw Telegram update object (with `update_id`).
   */
  update: Update
}

/**
 * Mapping of all tgcloud update handler types to their matching update payload types.
 */
export interface UpdatePayloads {
  message: NonNullable<Update['message']>
  edited_message: NonNullable<Update['edited_message']>
  channel_post: NonNullable<Update['channel_post']>
  edited_channel_post: NonNullable<Update['edited_channel_post']>
  inline_query: NonNullable<Update['inline_query']>
  chosen_inline_result: NonNullable<Update['chosen_inline_result']>
  callback_query: NonNullable<Update['callback_query']>
  guest_message: NonNullable<Update['guest_message']>
  business_connection: NonNullable<Update['business_connection']>
  business_message: NonNullable<Update['business_message']>
  edited_business_message: NonNullable<Update['edited_business_message']>
  deleted_business_messages: NonNullable<Update['deleted_business_messages']>
  shipping_query: NonNullable<Update['shipping_query']>
  pre_checkout_query: NonNullable<Update['pre_checkout_query']>
  purchased_paid_media: NonNullable<Update['purchased_paid_media']>
  subscription: NonNullable<Update['subscription']>
  message_reaction: NonNullable<Update['message_reaction']>
  message_reaction_count: NonNullable<Update['message_reaction_count']>
  poll: NonNullable<Update['poll']>
  poll_answer: NonNullable<Update['poll_answer']>
  my_chat_member: NonNullable<Update['my_chat_member']>
  chat_member: NonNullable<Update['chat_member']>
  chat_join_request: NonNullable<Update['chat_join_request']>
  chat_boost: NonNullable<Update['chat_boost']>
  removed_chat_boost: NonNullable<Update['removed_chat_boost']>
  managed_bot: NonNullable<Update['managed_bot']>
}

/**
 * Type of an update handler function for a specific update type.
 *
 * @example
 * ```js
 * // handlers/message.js
 * /** @type {import('sdk').UpdateHandler<'message'>} *\/
 * export default async function (message, ctx) {
 *   await api.sendMessage({
 *     chat_id: message.chat.id,
 *     text: `You said: ${message.text ?? ''}`,
 *   });
 * }
 * ```
 */
export type UpdateHandler<K extends keyof UpdatePayloads> = (
  payload: UpdatePayloads[K],
  ctx: HandlerContext,
) => any | Promise<any>

/**
 * Generic handler function signature.
 */
export type Handler<TPayload = any, TContext extends HandlerContext = HandlerContext> = (
  payload: TPayload,
  ctx: TContext,
) => any | Promise<any>
