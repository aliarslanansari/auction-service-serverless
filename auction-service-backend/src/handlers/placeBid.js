import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import { getAuctionById } from './getAuction'

const dynamoDB = new AWS.DynamoDB.DocumentClient()
let cached = 0
async function placeBid(event, context) {
  let updatedAuction
  const { id } = event.pathParameters
  const { amount } = event.body

  const auction = await getAuctionById(id)

  if (auction.status === 'CLOSED') {
    throw new createErrors.Forbidden(`You cannot Bid on closed auctions`)
  }

  if (amount <= auction.highestBid.amount) {
    throw new createErrors.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}`
    )
  }

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
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = commonMiddleware(placeBid)
