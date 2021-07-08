import AWS from 'aws-sdk'

const dynamodb = new AWS.DynamoDB.DocumentClient()

export async function closeAuction(auction) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auction.id },
    UpdateExpression: 'set #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': 'CLOSED',
    },
  }
  const result = await dynamodb.update(params).promise()
  return result
}
