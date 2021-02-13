import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { JSONResponse } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  try {
    await deleteTodo(getUserId(event), todoId)
    return JSONResponse({
      'message': 'todo deleted successfully'
    })
  } catch (e) {
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }
}
