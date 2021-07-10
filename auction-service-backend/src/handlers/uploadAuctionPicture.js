import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import createErrors from 'http-errors'
import uploadPicturesToS3 from './../lib/uploadPicturesToS3'
import { getAuctionById } from './getAuction'
import setAuctionPictureUrl from './../lib/setAuctionPictureUrl'
import uploadAuctionPictureSchema from '../lib/schemas/uploadAuctionPictureSchema'
import validator from '@middy/validator'

export async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters
  const { email } = event.requestContext.authorizer

  const auction = await getAuctionById(id)
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  if (email !== auction.seller) {
    throw new createErrors.Forbidden(
      `You are not authorized to perform this operation!`
    )
  }
  let updatedAuction
  try {
    const pictureURL = await uploadPicturesToS3(`${auction.id}.jpg`, buffer)
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureURL)
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  }
}

export const handler = middy(uploadAuctionPicture)
  .use(httpErrorHandler())
  .use(
    validator({
      inputSchema: uploadAuctionPictureSchema,
    })
  )
