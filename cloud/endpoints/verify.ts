import { JWT_SECRET } from 'lib/constants'
import { verifyJwt } from 'lib/jwt'
import { verifyTurnstile } from 'lib/turnstile'
import { EndpointError, type EndpointHandler } from 'sdk'
import { accept, decline, deletePendingRequestById, findPendingRequestById } from 'lib/join_request'

type Query = {
  token: string
  request_token: string
  version: string
  platform: string
}

type DecodedToken = {
  request_id: string
}

const handler: EndpointHandler<Query, object> = async (input, ctx) => {
  const user = ctx.initData.user
  if (!user) {
    throw new EndpointError('NOT_LOGGED_IN')
  }
  if (!input.request_token || !input.token) {
    throw new EndpointError('INVALID_REQUEST', { input: input })
  }

  const decoded = await decodeJwt(input.request_token)
  const requestId = decoded.request_id
  const request = await findPendingRequestById(requestId)
  if (!request) {
    throw new EndpointError('INVALID_REQUEST', { input: input })
  }

  const userId = request.user_id

  if (userId !== user.id) {
    await decline(request)
    throw new EndpointError('INVALID_REQUEST', { input: input })
  }

  // Verify captcha challenge
  const token = input.token
  try {
    await verifyTurnstile(token)
  } catch (err: unknown) {
    console.error(err)
    await decline(request)
    throw new EndpointError('CAPTCHA_NOT_PASSED', {
      error: err instanceof Error ? err.message : String(err),
    })
  }

  await accept(request)

  await deletePendingRequestById(requestId)

  return {}
}

async function decodeJwt(token: string): Promise<DecodedToken> {
  try {
    return verifyJwt(token, JWT_SECRET) as DecodedToken
  } catch (err: unknown) {
    console.error(err)
    throw new EndpointError('REQUEST_OVERTIMED', {
      jwt: token,
    })
  }
}

export default handler
