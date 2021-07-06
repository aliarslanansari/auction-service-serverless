import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpEventNormalize from '@middy/http-event-normalizer'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import createErrors from 'http-errors'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function getAuctions(event, context) {
  let auctions

  try {
    const results = await dynamoDB
      .scan({
        TableName: process.env.AUCTIONS_TABLE_NAME,
      })
      .promise()

    auctions = results.Items
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  }
}

export const handler = middy(getAuctions)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpEventNormalize())
