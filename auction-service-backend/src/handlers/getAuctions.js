import AWS from 'aws-sdk'
import createErrors from 'http-errors'
import commonMiddleware from '../lib/commonMiddleware'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function getAuctions(event, context) {
  const { status } = event.queryStringParameters
  let auctions

  if (!status) {
    throw new createErrors.BadRequest("'status' query parameter not provided")
  }
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status',
    ExpressionAttributeValues: {
      ':status': status,
    },
    ExpressionAttributeNames: {
      '#status': 'status',
    },
  }

  try {
    const results = await dynamoDB.query(params).promise()

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

export const handler = commonMiddleware(getAuctions)
