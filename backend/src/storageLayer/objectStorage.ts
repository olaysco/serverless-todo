import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'

const logger = createLogger('s3')

export class ObjectStorage {
    constructor(
        private readonly storage: AWS.S3 = getStorage(),
        private readonly bucketName: string = process.env.TODO_ATTACHMENT_BUCKET,
        private readonly expsIn: string = process.env.S3_URL_EXPIRATION
    ) { }
    
    /**
     * signs an object url to be used for upload
     * 
     * @param objectId
     * @returns Promise<string>
     */
    async signUrl(objectId: string): Promise<string> {
        logger.info(`signing upload URL key ${objectId} with ${this.expsIn} expiration time`)
        return this.storage.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: objectId,
            Expires: this.expsIn
        })
    }

    /**
     * returns an object url
     * 
     * @param objectId
     * @returns Promise<string>
     */
    async getUrl(objectId: string): Promise<string> {
        return `https://${this.bucketName}.s3.amazonaws.com/${objectId}`
    }
}

const getStorage = () => {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local S3 instance')
          return new AWS.S3({
            s3ForcePathStyle: true,
            accessKeyId: 'S3RVER',
            secretAccessKey: 'S3RVER',
            endpoint: 'http://localhost:8000',
        });
    }

    logger.info('Creating a cloud S3 instance')
    return new AWS.S3({ signatureVersion: 'v4' })
}
