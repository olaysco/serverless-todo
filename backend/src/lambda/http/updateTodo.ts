import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { JSONResponse } from '../../utils/response'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  try {
    await updateTodo(getUserId(event), todoId, updatedTodo)
    return JSONResponse({
      updatedTodo
    })
  } catch (e) {
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }
}
