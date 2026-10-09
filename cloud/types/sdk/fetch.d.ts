/**
 * Helper object produced by `fetch.body.*` methods.
 * Automatically serializes the payload and sets the matching `Content-Type`.
 */
export interface FetchBodyHelper {
  readonly body: any
  readonly contentType: string
}

/**
 * Request options for outbound HTTP requests via `fetch`.
 */
export interface FetchRequestInit extends Omit<RequestInit, 'body'> {
  body?: BodyInit | FetchBodyHelper | null
}

/**
 * Response headers interface.
 */
export interface FetchHeaders {
  get(name: string): string | null
  has(name: string): boolean
  keys(): IterableIterator<string>
  values(): IterableIterator<string>
  entries(): IterableIterator<[string, string]>
  forEach(callback: (value: string, key: string, parent: FetchHeaders) => void): void
  [Symbol.iterator](): IterableIterator<[string, string]>
}

/**
 * Outbound HTTP response object as described in tgcloud SDK reference.
 */
export interface FetchResponse {
  readonly status: number
  readonly statusText: string
  readonly ok: boolean
  readonly url: string
  readonly headers: FetchHeaders
  readonly body: (AsyncIterable<Uint8Array> & ReadableStream<Uint8Array>) | null
  readonly bodyUsed: boolean
  json<T = any>(): Promise<T>
  text(): Promise<string>
}

/**
 * The `fetch` client and body helpers.
 */
export interface FetchFn {
  (url: string | URL, init?: FetchRequestInit): Promise<FetchResponse>
  body: {
    json(data: unknown): FetchBodyHelper
    form(data: Record<string, unknown>): FetchBodyHelper
    text(data: string): FetchBodyHelper
  }
}

/**
 * Outbound HTTP fetch client.
 */
export declare const fetch: FetchFn
