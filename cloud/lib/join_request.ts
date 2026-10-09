import { api, EndpointError, db } from 'sdk'
import { lte, inArray, eq } from 'sdk/db'
import { pendingRequests } from 'schema'
import { sha256 } from '@noble/hashes/sha2.js'
import { utf8ToBytes } from '@noble/hashes/utils.js'

export type PendingRequest = {
  user_id: number
  chat_id: number
  msg_id?: number
  query_id?: string
}

export const TTL = 3 * 60 // 3 minutes in seconds

export async function accept(request: PendingRequest) {
  try {
    if (request.query_id) {
      await api.answerChatJoinRequestQuery({
        chat_join_request_query_id: request.query_id,
        result: 'approve',
      })
    } else if (request.msg_id) {
      try {
        await api.deleteMessage({
          chat_id: request.user_id,
          message_id: request.msg_id,
        })
      } catch (err: unknown) {
        console.error(err)
      }
      await api.approveChatJoinRequest({
        chat_id: request.chat_id,
        user_id: request.user_id,
      })
    }
  } catch (err: unknown) {
    console.error(err)
    throw new EndpointError('INTERNAL_ERROR', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export async function decline(request: PendingRequest) {
  try {
    if (request.query_id) {
      await api.answerChatJoinRequestQuery({
        chat_join_request_query_id: request.query_id,
        result: 'decline',
      })
    } else if (request.msg_id) {
      try {
        await api.deleteMessage({
          chat_id: request.user_id,
          message_id: request.msg_id,
        })
      } catch (err: unknown) {
        console.error(err)
      }
      await api.declineChatJoinRequest({
        chat_id: request.chat_id,
        user_id: request.user_id,
      })
    }
  } catch (err: unknown) {
    console.error(err)
    throw new EndpointError('INTERNAL_ERROR', {
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export async function findPendingRequestById(request_id: string): Promise<PendingRequest | null> {
  return await db
    .select()
    .from(pendingRequests)
    .where(eq(pendingRequests.request_id, request_id))
    .get()
}

export async function deletePendingRequestById(request_id: string) {
  return await db.delete(pendingRequests).where(eq(pendingRequests.request_id, request_id))
}

export async function insertPendingRequest(request: PendingRequest) {
  const request_id =
    Date.now().toString() + ':' + sha256(utf8ToBytes(JSON.stringify(request))).toHex()
  await db.insert(pendingRequests).values({
    ...request,
    request_id,
    created_at: new Date(),
  })
  return request_id
}

export async function getAllPendingRequests() {
  return await db.select().from(pendingRequests).all()
}

async function getExpiredPendingRequests() {
  const expirationTime = Math.floor(Date.now() / 1000) - TTL
  return await db
    .select()
    .from(pendingRequests)
    .where(lte(pendingRequests.created_at, expirationTime))
    .all()
}

export async function cleanupPendingRequests(): Promise<void> {
  const expiredRequests = await getExpiredPendingRequests()
  for (const request of expiredRequests) {
    try {
      await decline(request)
    } catch (err: unknown) {
      console.error(err)
    }
  }
  await db
    .delete(pendingRequests)
    .where(
      inArray(
        pendingRequests.id,
        expiredRequests.map((r) => r.id),
      ),
    )
    .run()
}
