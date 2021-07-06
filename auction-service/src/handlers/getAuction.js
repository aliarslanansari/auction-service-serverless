import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

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

export const handler = commonMiddleware(getAuction)
