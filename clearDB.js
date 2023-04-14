const { MongoClient } = require('mongodb');

const clientD = 'mongodb',
      host = 'localhost',
      port = '27017',
      dbName = 'app',
      url = `${clientD}://${host}:${port}/${dbName}`;

const options = { useUnifiedTopology: true, useNewUrlParser: true };
const clientMongo = new MongoClient(url, options);
const arCollections = [
  'categories',
  'counterschemas',
  'menu',
  'orderschemas',
  'personalizationschemas',
  'posterconfigschemas',
  'tablesschemas',
  'telegramusers',
  'telegramusersschemas',
  'type-menu'
];

(async ()=>{
  await clientMongo.connect();
  const db = clientMongo.db("app");
  for (var i = 0; i < arCollections.length; i++) {
    var collection = db.collection(arCollections[i]);
    await collection.deleteMany();
  }
  console.log('success!');
  process.exit(-1);
})()
