import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function placeBid(event, context) {
  let updatedAuction
  const { id } = event.pathParameters
  const { amount } = event.body
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  }

  try {
    const result = await dynamoDB.update(params).promise()
    updatedAuction = result.Attributes
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }

  if (!updatedAuction) {
    throw new createErrors.NotFound(`Auction with ID ${id} not found!`)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = commonMiddleware(placeBid)
