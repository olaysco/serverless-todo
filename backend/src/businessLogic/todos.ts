import 'source-map-support/register'
import { v4 as uuidV4 } from 'uuid'
import { TodoAccess } from '../dataLayer/todoAccess'
import { TodoItem, TodoUpdate } from '../models'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { ObjectStorage } from '../storageLayer/objectStorage'
import { createLogger } from '../utils/logger'
import { HTTPException } from '../utils/exception'

const access = new TodoAccess()
const storage = new ObjectStorage()
const logger = createLogger('todos')

//create
const createTodo = async (userId: string, createTodoRequest: CreateTodoRequest) => {
    const todo: TodoItem = {
        ...createTodoRequest,
        userId,
        id: uuidV4(),
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
    }

    await access.createTodo(todo)

    return todo
}

//read
const getTodos = async (userId: string): Promise<TodoItem[]> => {
    return await access.getAllTodos(userId)
}

//update
const updateTodo = async (userId: string, id: string, updateTodoRequest: UpdateTodoRequest) => {
    const item = await access.getTodo(id)
    validateTodo(userId, item)    

    return await access.updateTodo(id, updateTodoRequest)
}

//delete
const deleteTodo = async (userId: string, id: string) => {
    const item = await access.getTodo(id)
    validateTodo(userId, item)

    await access.deleteTodo(id)
    return true
}

const getSignedUploadUrl = async (attachmentId: string) => {
    const url = await storage.signUrl(attachmentId);
    return url
}

const updateAttachmentUrl = async (userId: string, id: string, attachmentId: string) => {
    logger.info(`updating todo ${id} with attachment url ${attachmentId}`)
    const url = await storage.getUrl(attachmentId)
    const item = await access.getTodo(id)
    validateTodo(userId, item)

    const urlUpdate: TodoUpdate = {
        attachmentUrl: url
    }

    await access.updateTodoAttachment(id, urlUpdate)
    
    return true
}

const validateTodo = (userId: string, item: any) => {
    if (!item) {
        logger.error(`attempt to access a toditem that doesn't exist`)
        throw new HTTPException({message: 'Todo does not exist', code: 404})
    }

    if (item.userId !== userId) {
        logger.error(`unauthorized operation by ${userId} on todo ${item.id}`)
        throw new HTTPException({message: 'Unauthorized operation', code: 403})
    }

    return true
}

export {createTodo, getTodos, updateTodo, deleteTodo, getSignedUploadUrl, updateAttachmentUrl}
