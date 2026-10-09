import { table, integer, text, index } from 'sdk/db'

export const pendingRequests = table(
  'pending_requests',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    user_id: integer('user_id').notNull(),
    chat_id: integer('chat_id').notNull(),
    msg_id: integer('msg_id'),
    query_id: text('query_id'),
    request_id: text('request_id'),
    created_at: integer('created_at', {
      mode: 'timestamp',
    }).notNull(),
  },
  (t) => ({
    requestIdIdx: index('idx_request_id').on(t.request_id),
    createdAtIdx: index('idx_created_at').on(t.created_at),
  }),
)
