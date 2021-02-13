import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getTodos } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { JSONResponse } from '../../utils/response'
import { createLogger } from '../../utils/logger'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const items = await getTodos(getUserId(event))
    return JSONResponse({
      items
    })
  } catch (e) {
    console.log(e)
    createLogger('getTodo').error(`unable to get todo: ${e.message}`)
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }

}
