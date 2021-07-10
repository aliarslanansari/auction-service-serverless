import createErrors from 'http-errors'
import AWS from 'aws-sdk'

const dynamoDB = new AWS.DynamoDB.DocumentClient()

async function setAuctionPictureUrl(auctionId, pictureUrl) {
  let updatedAuction

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id: auctionId },
    UpdateExpression: 'set pictureUrl = :pictureUrl',
    ExpressionAttributeValues: {
      ':pictureUrl': pictureUrl,
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
  return updatedAuction
}

export default setAuctionPictureUrl
