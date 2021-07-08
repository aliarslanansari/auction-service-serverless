import { closeAuction } from '../lib/closeAuction'
import { getEndedAuctions } from '../lib/getEndedAuctions'
import createErrors from 'http-errors'

async function processAuctions(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions()
    const closePromises = auctionsToClose.map((auction) =>
      closeAuction(auction)
    )
    await Promise.all(closePromises)
    return { closed: closePromises.length }
  } catch (error) {
    console.error(error)
    throw new createErrors.InternalServerError(error)
  }
}

export const handler = processAuctions
