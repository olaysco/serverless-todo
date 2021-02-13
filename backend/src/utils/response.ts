import { APIGatewayProxyResult } from "aws-lambda"

export const JSONResponse = (response: Record<string, unknown>, statusCode:number = 200): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      ...response
    })
  }
}