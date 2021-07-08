import validator from '@middy/validator'
import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'
import placeBidSchema from '../lib/schemas/placeBidSchema'
import { getAuctionById } from './getAuction'

const dynamoDB = new AWS.DynamoDB.DocumentClient()
let cached = 0
async function placeBid(event, context) {
  const { email } = event.requestContext.authorizer
  let updatedAuction
  const { id } = event.pathParameters
  const { amount } = event.body

  const auction = await getAuctionById(id)

  if (email === auction.highestBid.bidder) {
    throw new createErrors.Forbidden(`You are already the highest bidder!`)
  }

  if (email === auction.seller) {
    throw new createErrors.Forbidden(`You cannot bid on your own auctions!`)
  }

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
    UpdateExpression:
      'set highestBid.amount = :amount, highestBid.bidder = :bidder',
    ExpressionAttributeValues: {
      ':amount': amount,
      ':bidder': email,
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

export const handler = commonMiddleware(placeBid).use(
  validator({ inputSchema: placeBidSchema })
)
