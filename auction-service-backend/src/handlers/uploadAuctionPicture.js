import { getAuctionById } from './getAuction'
import uploadPicturesToS3 from './../lib/uploadPicturesToS3'

export async function uploadAuctionPicture(event, context) {
  const { id } = event.pathParameters
  const auction = await getAuctionById(id)
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '')
  const buffer = Buffer.from(base64, 'base64')

  const uploadToS3Result = await uploadPicturesToS3(`${auction.id}.jpg`, buffer)

  console.log(uploadToS3Result)

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  }
}

export const handler = uploadAuctionPicture
