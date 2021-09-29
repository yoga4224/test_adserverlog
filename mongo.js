const { MongoClient } = require('mongodb');
const config = require('./config');

const uri = "mongodb+srv://"+config.MONGO_USER+":"+config.MONGO_PASSWORD+"@"+config.MONGO_HOST+"/"+config.MONGO_DATABASE+"?retryWrites=true&w=majority";
const client = new MongoClient(uri);

const insertOne = async (params) => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").insertOne(params);

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const updateOne = async (id, params) => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").updateOne({ id: id }, { $set: params });

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const upsert = async (id, params) => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").updateOne({ id: id }, { $set: params }, { upsert: true });

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const getAll = async () => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").find().toArray();

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const getById = async (id) => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").findOne({id:id});

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const getPagination = async (params) => {
    try {
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

        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").find(filter, option).toArray();
        const total_data = await client.db(config.MONGO_DATABASE).collection("imp_test").count(filter);

        var res = {success:true,total_rows:total_data,data:data};

    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const getUsingAggregate = async (params) => {
    try {
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

        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").aggregate(pipeline).toArray();

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
};

const deleteById = async (id) => {
    try {
        await client.connect();
        const data = await client.db(config.MONGO_DATABASE).collection("imp_test").deleteOne({ id: id });

        var res = {success:true,data:data};
    } catch (err) {
        var res = {success:false,msg: 'Something went wrong'};
    } finally {
        await client.close();
    }

    return res;
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