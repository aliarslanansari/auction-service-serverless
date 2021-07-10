import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import createErrors from 'http-errors'
import uploadPicturesToS3 from './../lib/uploadPicturesToS3'
import { getAuctionById } from './getAuction'

export async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')
  try {
    const uploadToS3Result = await uploadPicturesToS3(
      `${auction.id}.jpg`,
      buffer
    )
    console.log(uploadToS3Result)
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  }
}

export const handler = middy(uploadAuctionPicture).use(httpErrorHandler)
