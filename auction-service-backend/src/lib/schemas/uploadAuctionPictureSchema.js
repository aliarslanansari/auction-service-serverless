const schema = {
  properties: {
    body: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['body'],
  type: 'object',
}

export default schema
