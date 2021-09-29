const { MongoClient } = require('mongodb');
const config = require('./config');

const uri = "mongodb+srv://"+config.MONGO_USER+":"+config.MONGO_PASSWORD+"@"+config.MONGO_HOST+"/"+config.MONGO_DATABASE+"?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const insertOne = async (params) => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").insertOne(params);
    await client.close();
    return $data;
};

const updateOne = async (id, params) => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").updateOne({ id: id }, { $set: params });
    await client.close();
    return $data;
};

const upsert = async (id, params) => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").updateOne({ id: id }, { $set: params }, { upsert: true });
    await client.close();
    return $data;
};

const getAll = async () => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").find().toArray();
    await client.close();
    return $data;
};

const getById = async (id) => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").findOne({id:id});
    await client.close();
    return $data;
};

const getPagination = async (params) => {
    await client.connect();

    const limit = params.limit;
    const offset = (params.offset - 1)*limit;
    const filter = {
        'referer' : {$regex: `.*${params.name}`, $options:"i"}
    };
    const option = {
        'limit' : limit,
        'skip'  : offset,
        'sort'  : {'_id':-1}
    }

    const res = await client.db(config.MONGO_DATABASE).collection("imp_test").find(filter, option).toArray();
    const total_res = await client.db(config.MONGO_DATABASE).collection("imp_test").count(filter);

    await client.close();

    return {'total_rows': total_res, 'data': res}
};

const getUsingAggregate = async (params) => {
    await client.connect();
    const pipeline = [
        {
            '$group': {
                '_id': '$user_device.type',
                'totalLoaded': {
                    '$sum': '$loaded'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }
    ];

    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").aggregate(pipeline).toArray();
    await client.close();
    return $data;
};

const deleteById = async (id) => {
    await client.connect();
    $data = await client.db(config.MONGO_DATABASE).collection("imp_test").deleteOne({ id: id });
    await client.close();
    return $data;
};

module.exports = {
    insertOne,
    updateOne,
    upsert,
    getAll,
    getById,
    getPagination,
    getUsingAggregate,
    deleteById
};