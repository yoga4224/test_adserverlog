// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region 
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

// Create SQS service object
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

// Replace with your accountid and the queue name you setup
const accountId = process.env.AWS_SQS_ACCOUNT_ID;
const queueName = process.env.AWS_SQS_NAME;
const sqsUrl = process.env.AWS_SQS_URL;
const qurl = "https://sqs.ap-southeast-2.amazonaws.com/339964025065/queue-one";

// Setup the receiveMessage parameters
const params = {
  "QueueUrl" : qurl,
  "MaxNumberOfMessages": 1
//   VisibilityTimeout: 0,
//   WaitTimeSeconds: 0
};

sqs.receiveMessage(params, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    if (!data.Message) {
      console.log('Nothing to process');
      return;
    }

    const orderData = JSON.parse(data.Messages[0].Body);
    console.log('Order received', orderData);

    // orderData is now an object that contains order_id and date properties
    // Lookup order data from data storage
    // Execute billing for order
    // Update data storage

    // Now we must delete the message so we don't handle it again
    const deleteParams = {
      QueueUrl: `https://sqs.ap-southeast-2.amazonaws.com/339964025065/queue-one`,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    sqs.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        console.log('Successfully deleted message from queue');
      }
    });
  }
});