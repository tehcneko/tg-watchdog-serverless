import { api, type InputRichMessage, type RichBlockTableCell, type UpdateHandler } from 'sdk'
import { getAllPendingRequests } from 'lib/join_request'

export const handler: UpdateHandler<'message'> = async (message) => {
  const requests = await getAllPendingRequests()
  const tableRows: RichBlockTableCell[][] = []
  tableRows.push([
    { text: 'User ID', align: 'left', valign: 'middle', is_header: true },
    { text: 'Chat ID', align: 'left', valign: 'middle', is_header: true },
    { text: 'Message ID', align: 'left', valign: 'middle', is_header: true },
    { text: 'Query ID', align: 'left', valign: 'middle', is_header: true },
    { text: 'Request ID', align: 'left', valign: 'middle', is_header: true },
    { text: 'Created At', align: 'left', valign: 'middle', is_header: true },
  ])
  for (const request of requests) {
    tableRows.push([
      { text: `${request.user_id}`, align: 'left', valign: 'middle' },
      { text: `${request.chat_id}`, align: 'left', valign: 'middle' },
      { text: `${request.msg_id}`, align: 'left', valign: 'middle' },
      { text: `${request.query_id}`, align: 'left', valign: 'middle' },
      { text: `${request.request_id}`, align: 'left', valign: 'middle' },
      { text: `${request.created_at}`, align: 'left', valign: 'middle' },
    ])
  }
  const richMsg: InputRichMessage<string> = {
    blocks: [
      {
        type: 'paragraph',
        text: {
          type: 'bold',
          text: `Pending Requests`,
        },
      },
      {
        type: 'table',
        cells: tableRows,
        is_striped: true,
        is_bordered: true,
      },
    ],
  }

  await api.sendRichMessage({
    chat_id: message.chat.id,
    rich_message: richMsg,
  })
}

export default handler
