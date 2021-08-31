const AWS = require('aws-sdk');
require('dotenv').config();
AWS.config.update({
    // endpoint: "http://localhost:8000",
    region: 'ap-southeast-2',
    accessKeyId: 'AKIAU6J3PLDU6EEIRTPP',
    secretAccessKey: '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'
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
};
