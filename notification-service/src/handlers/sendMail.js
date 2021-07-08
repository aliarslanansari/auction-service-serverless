import AWS from 'aws-sdk'

const ses = new AWS.SES({ region: 'eu-west-1' })
async function sendMail(event, context) {
  const params = {
    Source: 'aliarslan1620@gmail.com',
    Destination: {
      ToAddresses: ['aliarslan1620@gmail.com'],
    },
    Message: {
      Body: {
        Text: {
          Data: 'Hello from ALI',
        },
      },
      Subject: {
        Data: 'Test Email',
      },
    },
  }

  try {
    const result = await ses.sendEmail(params).promise()
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }
}

export const handler = sendMail
