# Setup

## Upload to AWS Lambda
```
$ npm install
$ node-lambda package
```

Then upload the zip file to your AWS Lambda account.

*Reference: [node-lambda](https://www.npmjs.com/package/node-lambda)*


## Set Environment Variables on AWS Lambda
- WEBHOOK_URL: Webhook URL of your Slack

## Set up AWS CloudWatch
Create scheduled event to invoke the Lambda function.