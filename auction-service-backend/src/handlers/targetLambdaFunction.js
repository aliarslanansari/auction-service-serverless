async function targetLambdaFunction(event /*, context*/) {
  console.log({
    statusCode: 200,
    body: JSON.stringify({ event, date: new Date().toISOString() }),
  })
  return {
    statusCode: 200,
    body: JSON.stringify({ event, date: new Date().toISOString() }),
  }
}

export const handler = targetLambdaFunction
