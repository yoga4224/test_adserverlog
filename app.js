const AWS = require('aws-sdk');
const requestIp = require('request-ip');
const serverless = require('serverless-http');
// const serverless = require('serverless-http');
const express = require('express');
const {v4 : uuidv4} = require('uuid')

const app = express();

const {
    addOrUpdateCharacter,
    getCharacters,
    deleteCharacter,
    getCharacterById,
    updateCharacter,
    selectUsingSql,
} = require('./dynamo');

const {
    insertOne:mongoInsert,
    updateOne:mongoUpdate,
    upsert:mongoUpsert,
    getAll:mongoGetAll,
    getById:mongoGetById,
    getPagination:mongoGetPagination,
    getUsingAggregate:mongoGetUsingAggregate,
    deleteById:mongoDeleteById,
} = require('./mongo');

const {
    getMessage,
} = require('./sqsRecive');

const {
    sendingMessage,
} = require('./sqsSend');

const config = require('./config');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const config = require('./config');
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/send', async (req, res) => {

})
app.get('/log', async (req, res) => {
    try {
        const characters = await getCharacters();
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.get('/log-sql', async (req, res) => {
    try {
        const characters = await selectUsingSql();
        res.json(characters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
});

app.get('/log/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const character = await getCharacterById(id);
        res.json(character);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/log', async (req, res) => {
    const character = req.body;
    try {
        const newCharacter = await addOrUpdateCharacter(character);
        res.json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.put('/log/:id', async (req, res) => {
    const character = req.body;
    const id = parseInt(req.params.id);
    character.id = id;
    try {
        const newCharacter = await updateCharacter(character);
        res.json(newCharacter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
});

app.delete('/log/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        res.json(await deleteCharacter(id));
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.get('/message', async (req, res) => {
    try {
        const msg = await getMessage();
        res.json(msg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err });
    }
});

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
    
/* ============= test using mongo ================= */

app.post('/imp', async (req, res) => {
    const params = req.body;
    const data = await mongoInsert(params);
    res.status(200).json(data);
});

app.post('/imp-update/:id', async (req, res) => {
    const id = req.params.id;
    const params = req.body;
    const data = await mongoUpdate(id,params);
    res.status(200).json(data);
});

app.post('/imp-upsert/:id', async (req, res) => {
    const id = req.params.id;
    const params = req.body;
    const data = await mongoUpsert(id,params);
    res.status(200).json(data);
});

app.get('/imp', async (req, res) => {
    const data = await mongoGetAll();
    res.status(200).json(data);
});

app.get('/imp/:id', async (req, res) => {
    const id = req.params.id;
    const data = await mongoGetById(id);
    res.status(200).json(data);
});

app.get('/imp-pagination', async (req, res) => {
    const params = req.body;
    const data = await mongoGetPagination(params);
    res.status(200).json(data);
});

app.get('/imp-loaded', async (req, res) => {
    const params = req.body;
    const data = await mongoGetUsingAggregate(params);
    res.status(200).json(data);

});

const port = config.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port port`);
});

// const port = config.PORT || 3000;
// app.listen(port, () => {
//     console.log(`listening on port port`);
// });

module.exports.handler = serverless(app);