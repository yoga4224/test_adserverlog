const AWS = require('aws-sdk');
const requestIp = require('request-ip');
const serverless = require('serverless-http');
const express = require('express');
const {v4 : uuidv4} = require('uuid')

const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const config = require('./config');

// Set the region we will be using
const region =  config.AWS_DEFAULT_REGION;
AWS.config.update({region: `${region}`});
AWS.config.update({
    // region: config.AWS_DEFAULT_REGION,
    accountId: config.AWS_SQS_ACCOUNT_ID,
    queueName: config.AWS_SQS_NAME,
    QueueUrl : config.AWS_SQS_URL,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
});

// Create SQS service client
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = "https://sqs.ap-southeast-2.amazonaws.com/339964025065/queue-one";

app.get('/tracker', (req, res) => {

    var clientIp = requestIp.getClientIp(req);
    const userId    = uuidv4();
    var ips         = clientIp; 

    const cachebuster   = (new Date(1630656110158)).toISOString()
    const referer       = req.query.referer;

    // Setup the sendMessage parameter object
    const params = {
        MessageBody: JSON.stringify({
            id: userId,
            cachebuster: cachebuster,
            referer: referer,
            ip: ips,
        }),
    //   QueueUrl: `${sqsUrl}/${accountId}/${queueName}`
        QueueUrl:queueUrl
    };

      // Send the order data to the SQS queue
      const sendSqsMessage = sqs.sendMessage(params).promise();

      sendSqsMessage.then((data) => {
        console.log(`insert | SUCCESS: ${data.MessageId}`);
        res.send("Thank you");
        }).catch((err) => {
            console.log(`insert | ERROR: ${err}`);

            // Send email to emails API
            res.send("We ran into an error. Please try again.");
    });
    
});

// const port = config.PORT || 3000;
// app.listen(port, () => {
//     console.log(`listening on port port`);
// });

module.exports.handler = serverless(app);