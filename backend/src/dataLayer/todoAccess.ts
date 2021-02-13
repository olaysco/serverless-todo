import { TodoItem, TodoUpdate } from "../models"
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { createLogger } from "../utils/logger"

const logger = createLogger('todoAccess')

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosUserIndex = process.env.TODOS_USER_INDEX
    ) { }

    /**
     * Creates a todo item
     * 
     * @param todoItem TodoItem
     * @returns Promise<TodoItem>
     */
    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todoItem
        }).promise()

        return todoItem
    }
    
     /**
     * Updates a todo item
     * 
     * @param id string
     * @param todoItem TodoUpdate
     * @returns Promise<any>
     */
    async updateTodo(id: string, todoItem: TodoUpdate): Promise<any> {
        const result = await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                id
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": todoItem.name,
                ":dueDate": todoItem.dueDate,
                ":done": todoItem.done
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        if (!result.$response.error) {
            return result.$response.data
        }
        
        return result.$response.error.message
        
    }

     /**
     * U[dates Todo attachment URL only
     * 
     * @param id string
     * @param todoUpdate TodoUpdate
     * @returns Promise<void>
     */
    async updateTodoAttachment(id: string, todoUpdate: TodoUpdate): Promise<void> {
        logger.info(`begin: updating todo ${id}  url: ${todoUpdate.attachmentUrl}`)
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                id
            },
            UpdateExpression: 'set attachmentUrl = :url',
            ExpressionAttributeValues: {
                ':url': todoUpdate.attachmentUrl
            }
        }).promise()
        logger.info(`end: updating todo ${id}  url: ${todoUpdate.attachmentUrl}`)
    }

     /**
     * Asserts a todo item exists in DB
     * 
     * @param id string
     * @returns Promise<boolean>
     */
    async checkTodoExists(id: string): Promise<boolean> {
        const todo = await this.getTodo(id);
        if (todo) {
            return true
        }
        return false
    }
    
    /**
     * Retrieves all todo items for  a user
     * 
     * @param userId string
     * @returns Promise<TodoItem[]>
     */
    async getAllTodos(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.todosUserIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items as TodoItem[]
    }

    async getTodo(id: string): Promise<TodoItem> {
        const result = await this.docClient.get({
            TableName: this.todosTable,
            Key: {
                id
            }
        }).promise();

        return result.Item as TodoItem
    }

    /**
     * Deletes a todo item
     * 
     * @param id string
     * @returns Promise<void>
     */
    async deleteTodo(id: string): Promise<void> {
        logger.info(`begin: deleting todo ${id} `)
        this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                id
            }
        }).promise()
        logger.info(`end: deleted todo ${id} `)
    }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  logger.info('Creating a cloud DynamoDB instance')
  return new XAWS.DynamoDB.DocumentClient()
}