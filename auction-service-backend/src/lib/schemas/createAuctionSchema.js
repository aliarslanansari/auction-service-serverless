const schema = {
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
      },
      required: ['title'],
    },
  },
  required: ['body'],
  type: 'object',
}

export default schema
