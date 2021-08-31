const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
    // endpoint: "http://localhost:8000",
    accountId: config.AWS_SQS_ACCOUNT_ID,
    queueName: config.AWS_SQS_NAME,
    QueueUrl : config.AWS_SQS_URL,
    region: config.AWS_DEFAULT_REGION,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const qurl = config.AWS_SQS_URL;

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'log';

const getMessage = async () => {
  var arr = [];
  const params = {
    AttributeNames: [
      "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
      "All"
    ],
    QueueUrl: qurl,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
  };

  try {
    const msg = await sqs.receiveMessage(params).promise();
    for (const element of msg.Messages) {
      var data_msg = JSON.parse(element.Body);
      // data_msg.id = Math.floor(Math.random() * 10000);

      const dbparams = {
        TableName: TABLE_NAME,
        Item: data_msg,
      };

      try{
        dynamoClient.put(dbparams).promise();
      } catch (err) {
        console.log(err);
      }
      
      const deleteParams = {
        QueueUrl: qurl,
        ReceiptHandle: element.ReceiptHandle
      };

      try {
        const delete_msg = await sqs.deleteMessage(deleteParams).promise();
      } catch (err) {
          console.log(err);
      }

      arr.push(data_msg);
    }
  } catch (err) {
      console.log(err);
  }
  return arr;
};

module.exports = {
  getMessage
};