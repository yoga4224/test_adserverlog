// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region we will be using
const region =  process.env.AWS_DEFAULT_REGION;
AWS.config.update({region: `${region}`});
AWS.config.update({
    // region: process.env.AWS_DEFAULT_REGION,
    accountId: process.env.AWS_SQS_ACCOUNT_ID,
    queueName: process.env.AWS_SQS_NAME,
    QueueUrl : process.env.AWS_SQS_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create SQS service client
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Replace with your accountid and the queue name you setup
const accountId = process.env.AWS_SQS_ACCOUNT_ID;
const queueName = process.env.AWS_SQS_NAME;
const sqsUrl = process.env.AWS_SQS_URL;

// Setup the sendMessage parameter object
const params = {
  MessageBody: JSON.stringify({
    id: 1234,
    created_date: (new Date()).toISOString(),
    name : `sqs_message_` + Math.floor(Math.random() * 100000)
  }),
//   QueueUrl: `${sqsUrl}/${accountId}/${queueName}`
  QueueUrl: `https://sqs.ap-southeast-2.amazonaws.com/339964025065/queue-one`
};

sqs.sendMessage(params, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Successfully added message", data.MessageId);
  }
});