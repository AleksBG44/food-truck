// const { MongoClient, ObjectId } = require("mongodb");

// const { uri } = require('./db/mongodb.json')

// const client = new MongoClient(uri)

// const getCollection = async (dbName, collectionName) => {
//     await client.connect()
//     return client.db(dbName).collection(collectionName)
// }

// module.exports = { getCollection, ObjectId}



const { MongoClient, ObjectId } = require("mongodb");
const { uri } = require('./db/mongodb.json');

const client = new MongoClient(uri);

let db;

const connect = async () => {
    if (!db) {
        await client.connect();
        db = client.db("foodtruckdb");
        console.log("Connected to MongoDB");
    }
    return db;
};

const getCollection = async (dbName, collectionName) => {
    const db = await connect();
    return db.collection(collectionName);
};

module.exports = { getCollection, ObjectId };