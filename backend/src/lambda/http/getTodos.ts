import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { JSONResponse } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const items = await getTodos(getUserId(event))
    return JSONResponse({
      items
    })
  } catch (e) {
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }

}
