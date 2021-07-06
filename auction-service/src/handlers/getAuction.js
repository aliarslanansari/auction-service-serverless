import AWS from 'aws-sdk'
import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import httpEventNormalize from '@middy/http-event-normalizer'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import createErrors from 'http-errors'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function getAuction(event, context) {
  let auction
  const { id } = event.pathParameters

  try {
    const result = await dynamoDB
      .get({ TableName: process.env.AUCTIONS_TABLE_NAME, Key: { id } })
      .promise()

    auction = result.Item
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }

  if (!auction) {
    throw new createErrors.NotFound(`Auction with ID ${id} not found!`)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  }
}

export const handler = middy(getAuction)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(httpEventNormalize())
