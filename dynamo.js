const AWS = require('aws-sdk');
const config = require('./config');

AWS.config.update({
    // endpoint: "http://localhost:8000",
    region: config.AWS_DEFAULT_REGION,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'log';
const getCharacters = async () => {
    const params = {
        TableName: TABLE_NAME,
    };
    const characters = await dynamoClient.scan(params).promise();
    return characters;
};

const getCharacterById = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.get(params).promise();
};

const addOrUpdateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Item: character,
    };
    return await dynamoClient.put(params).promise();
};

const updateCharacter = async (character) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: character.id
        },
        UpdateExpression: `set created_date = :valname`,
        ExpressionAttributeValues: {
        ":valname": character.created_date,
        },
    };

    console.log(params);

    return await dynamoClient.update(params).promise();
};

const deleteCharacter = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };
    return await dynamoClient.delete(params).promise();
};

module.exports = {
    dynamoClient,
    getCharacters,
    getCharacterById,
    addOrUpdateCharacter,
    deleteCharacter,
    updateCharacter,
};
