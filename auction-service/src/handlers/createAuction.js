import { v4 as uuid } from 'uuid'
import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpEventNormalize from '@middy/http-event-normalizer'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import createErrors from 'http-errors'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {
  const { title } = event.body
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    createdAt: now.toISOString(),
  }
  try {
    await dynamoDB
      .put({
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
      })
      .promise()
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  }
}

export const handler = middy(createAuction)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpEventNormalize())
