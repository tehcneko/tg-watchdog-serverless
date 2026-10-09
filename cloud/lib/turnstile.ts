import { fetch } from 'sdk'
import { API_KEY } from 'lib/constants'

export async function verifyTurnstile(response: string) {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: fetch.body.form({ secret: API_KEY, response: response }),
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error('CAPTCHA_NOT_PASSED')
    }
  } catch (e: unknown) {
    console.error(e)
    throw new Error('CAPTCHA_ERROR')
  }
}
