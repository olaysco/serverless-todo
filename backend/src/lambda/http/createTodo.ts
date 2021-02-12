import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { JSONResponse } from '../../utils/response'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  try {
    const item = await createTodo(getUserId(event), newTodo)
    return JSONResponse({ item }, 201)
  } catch (e) {
    return JSONResponse({'message': e.message ?? 'internal server error'}, e.code?? 500)
  }
  
}
