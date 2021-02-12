import 'source-map-support/register'
import { v4 as uuidV4 } from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getSignedUploadUrl, updateAttachmentUrl } from '../../businessLogic/todos'
import { JSONResponse } from '../../utils/response'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const attachmentId = uuidV4()

  try {
    const uploadUrl = await getSignedUploadUrl(attachmentId)
    await updateAttachmentUrl(getUserId(event), todoId, attachmentId)
    return JSONResponse({
      uploadUrl
    })
  } catch (e) {
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }
}
