import AWS from 'aws-sdk'

const eventBridge = new AWS.EventBridge()
const lambda = new AWS.Lambda()

const getAuction = async (event) => {
  const ruleName = process.env.CLOSE_AUCTION_EVENT_RULE_NAME
  const ruleParams = {
    Name: ruleName,
    ScheduleExpression: 'rate(1 minute)',
  }

  const rule = await eventBridge.putRule(ruleParams).promise()

  const permissionParams = {
    Action: 'lambda:InvokeFunction',
    FunctionName: process.env.CLOSE_AUCTION_LAMBDA_NAME,
    Principal: 'events.amazonaws.com',
    StatementId: ruleName,
    SourceArn: rule.RuleArn,
  }

  await lambda.addPermission(permissionParams).promise()

  const targetParams = {
    Rule: ruleName,
    Targets: [
      {
        Id: `${ruleName}-target`,
        Arn: process.env.CLOSE_AUCTION_LAMBDA_ARN,
        Input: '{ "auctionId": "helloALI" }',
      },
    ],
  }

  const result = await eventBridge.putTargets(targetParams).promise()

  return result
}

export const handler = getAuction
