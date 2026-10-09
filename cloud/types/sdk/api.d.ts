import type { ApiMethods, ResponseParameters } from '@grammyjs/types'

/**
 * Error thrown when a Telegram Bot API request returns `{ ok: false }`.
 */
export declare class BotApiError extends Error {
  /** Telegram Bot API error code (e.g. 400, 403, 429). */
  readonly code: number
  /** Human-readable description returned by Telegram. */
  readonly description: string
  /** The Bot API method name that failed. */
  readonly method: string
  /** Additional error parameters from Telegram, such as `retry_after` or `migrate_to_chat_id`. */
  readonly parameters?: ResponseParameters

  constructor(message: string, code: number, method: string, parameters?: ResponseParameters)
}

/**
 * Maps all Telegram Bot API methods to return unwrapped result Promises.
 */
type PromisifiedBotMethods = {
  [M in keyof ApiMethods<any>]: (
    ...args: Parameters<ApiMethods<any>[M]>
  ) => Promise<ReturnType<ApiMethods<any>[M]>>
}

/**
 * Unwrapped Telegram Bot API client.
 * Calls dispatch dynamically via Proxy (`api.<method>(params)`).
 */
export type ApiClient = PromisifiedBotMethods & {
  /**
   * Fallback for any current or future Bot API methods dispatched dynamically.
   */
  [method: string]: (params?: any) => Promise<any>
}

/**
 * Telegram Bot API client instance.
 */
export declare const api: ApiClient

export * from '@grammyjs/types'
