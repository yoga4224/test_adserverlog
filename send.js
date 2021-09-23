const http = require('http');
const url = require('url');
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


http.createServer(function (req, res) {
  const queryObject = url.parse(req.url,true).query;
  console.log(queryObject);

  // Setup the sendMessage parameter object
const params = {
  MessageBody: JSON.stringify({
    uuid: "1db0a037-49c2-416b-be06-c36ea079578e",
    ad_id: "123",
    cb: "2021-09-03T08:01:50.158Z",
    timestamp: "1631241958887",
    referer : "https://www.w3schools.com/js/tryit.asp?filename=tryjson_stringify",
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

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Feel free to add query parameters to the end of the url');
}).listen(3030);
