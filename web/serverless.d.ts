import '@types/telegram-web-app'

declare module '@types/telegram-web-app' {
  interface WebApp {
    Serverless: Serverless
  }
}

/**
 * Custom Error object returned by the Serverless endpoint callback.
 */
export interface ServerlessError extends Error {
  /** A human-readable description of the error. */
  message: string
  /**
   * The type of the error returned by the platform.
   * "ENDPOINT_ERROR" if the endpoint refused the call by throwing an EndpointError.
   * Other values indicate errors reported by the platform (e.g., "UNAUTHORIZED").
   */
  type?: 'ENDPOINT_ERROR' | 'UNAUTHORIZED' | (string & {})
  /** The HTTP status code of the response, or 0 if the request could not be completed. */
  status: number
  /** Additional data passed by the endpoint along with its EndpointError. */
  parameters?: Record<string, unknown>
}

/**
 * Standard Node-style callback supporting discriminated union based on `error`.
 */
export type ServerlessCallback<TResponse = unknown> =
  | ((error: null, result: TResponse) => void)
  | ((error: ServerlessError, result?: undefined) => void)

/**
 * JSON-serializable types for the optional input parameter.
 */
export type JsonPrimitive = string | number | boolean | null
export type JsonValue = JsonPrimitive | JsonObject | JsonArray
export interface JsonObject {
  [key: string]: JsonValue
}
export type JsonArray = JsonValue[]

export interface Serverless {
  /**
   * Calls the endpoint with the specified name.
   *
   * @param name The endpoint name.
   * @param input Optional JSON-serializable payload.
   * @param callback Optional callback invoked on completion.
   */
  call<TResponse = unknown, TInput extends JsonValue = JsonValue>(
    name: string,
    input?: TInput,
    callback?: ServerlessCallback<TResponse>,
  ): void

  /**
   * Overload: call without input payload.
   */
  call<TResponse = unknown>(name: string, callback?: ServerlessCallback<TResponse>): void
}
