# :rocket::rocket::rocket:Setup:rocket::rocket::rocket:

## :rocket:Upload to AWS Lambda
```
$ npm install
$ node-lambda package
```

Then upload the zip file to your AWS Lambda account.

*Reference: [node-lambda](https://www.npmjs.com/package/node-lambda)*


## :rocket:Set Environment Variables on AWS Lambda
- WEBHOOK_URL: Webhook URL of your Slack

## :rocket:Set up AWS CloudWatch
Create scheduled event to invoke the Lambda function.

## :rocket:Set the icon of the webhook to :rocket:
