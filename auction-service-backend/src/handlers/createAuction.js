import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import { v4 as uuid } from 'uuid'
import commonMiddleware from '../lib/commonMiddleware'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function createAuction(event, context) {
  const { title } = event.body
  const now = new Date()

  const auction = {
    id: uuid(),
    title,
    status: 'OPEN',
    highestBid: {
      amount: 0,
    },
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

export const handler = commonMiddleware(createAuction)
