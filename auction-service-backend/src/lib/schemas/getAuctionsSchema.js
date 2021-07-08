const schema = {
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED'],
          default: 'OPEN',
        },
      },
    },
  },
  required: ['queryStringParameters'],
  type: 'object',
}

export default schema
