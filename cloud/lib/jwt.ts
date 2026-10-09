import { hmac } from '@noble/hashes/hmac.js'
import { sha256 } from '@noble/hashes/sha2.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder('utf-8', { fatal: true })

function encodeBase64Url(bytes: Uint8Array): string {
  return bytes.toBase64({ alphabet: 'base64url', omitPadding: true })
}

function decodeBase64Url(value: string): Uint8Array {
  return Uint8Array.fromBase64(value, { alphabet: 'base64url' })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function serialize(value: Record<string, unknown>): string {
  const result = JSON.stringify(value)
  if (result === undefined) {
    throw new TypeError('JWT header and claims must be JSON-serializable objects')
  }
  return result
}

function constantTimeEqual(left: Uint8Array, right: Uint8Array): boolean {
  let difference = left.length ^ right.length
  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index++) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0)
  }
  return difference === 0
}

/**
 * Sign JSON claims as a compact JWT using HS256.
 */
export function signJwt<TClaims extends Record<string, unknown>>(
  claims: TClaims,
  secret: string,
): string {
  if (secret.length === 0) {
    throw new TypeError('JWT secret must not be empty')
  }

  const header = encodeBase64Url(encoder.encode('{"alg":"HS256","typ":"JWT"}'))
  const payload = encodeBase64Url(encoder.encode(serialize(claims)))
  const signingInput = `${header}.${payload}`
  const signature = hmac(sha256, encoder.encode(secret), encoder.encode(signingInput))
  return `${signingInput}.${encodeBase64Url(signature)}`
}

/**
 * Verify a compact HS256 JWT and return its claims.
 *
 * Validates `exp` and `nbf` when present, using Unix seconds.
 */
export function verifyJwt<TClaims extends Record<string, unknown> = Record<string, unknown>>(
  token: string,
  secret: string,
): TClaims {
  if (secret.length === 0) {
    throw new TypeError('JWT secret must not be empty')
  }

  const parts = token.split('.')
  if (parts.length !== 3) {
    throw new Error('Invalid JWT')
  }

  try {
    const header = JSON.parse(decoder.decode(decodeBase64Url(parts[0])))
    if (!isRecord(header) || header.alg !== 'HS256') {
      throw new Error('Invalid JWT')
    }

    const signingInput = `${parts[0]}.${parts[1]}`
    const expected = hmac(sha256, encoder.encode(secret), encoder.encode(signingInput))
    const actual = decodeBase64Url(parts[2])
    if (!constantTimeEqual(expected, actual)) {
      throw new Error('Invalid Signature')
    }

    const claims: unknown = JSON.parse(decoder.decode(decodeBase64Url(parts[1])))
    if (!isRecord(claims)) {
      throw new Error('Invalid Claims')
    }

    const now = Date.now() / 1000
    if (
      claims.exp !== undefined &&
      (typeof claims.exp !== 'number' || !Number.isFinite(claims.exp))
    ) {
      throw new Error('Invalid Exp')
    }
    if (claims.exp !== undefined && claims.exp <= now) {
      throw new Error('JWT expired')
    }
    if (
      claims.nbf !== undefined &&
      (typeof claims.nbf !== 'number' || !Number.isFinite(claims.nbf))
    ) {
      throw new Error('Invalid Nbf')
    }
    if (claims.nbf !== undefined && claims.nbf > now) {
      throw new Error('JWT not active')
    }

    return claims as TClaims
  } catch (error) {
    console.error(error)
    if (
      error instanceof Error &&
      (error.message === 'JWT expired' || error.message === 'JWT not active')
    ) {
      throw error
    }
    throw new Error('Invalid JWT')
  }
}
