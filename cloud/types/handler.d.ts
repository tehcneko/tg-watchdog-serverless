import type { Handler as SdkHandler, HandlerContext, UpdatePayloads } from 'sdk'

export type Handler<TPayload, TAdditionalContext extends object = object> = SdkHandler<
  TPayload,
  HandlerContext & TAdditionalContext
>

export type UpdateHandler<
  K extends keyof UpdatePayloads,
  TAdditionalContext extends object = object,
> = Handler<UpdatePayloads[K], TAdditionalContext>
