const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const dbName = 'startup-vt';
const MongoURL = process.env.MONGO_CONNECTION || `mongodb://localhost:27017/${dbName}`;
let connection = null;

app.use(express.static('build'))

app.get('/test', async (request, response, closeConnection) => {
  const results = await printAll();
  console.log({ results });
  response.send(results);
  next(closeConnection);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

function closeConnection () {
  console.log('CLOSE CONNECTION')
  connection.close();
}
// Open (or reuse) a connection to the database and
// return the MongoDB Client.
async function theClient() {
  console.log('calling client')
    // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
    console.log(`Connecting to ${MongoURL}...`);
    if (connection) {
      return connection;
    } else {
      connection = await MongoClient.connect(
        MongoURL,
        { useNewUrlParser: true }
      );
      console.log("Connected to database.");
      return connection;  
    }
};

async function collection() {
  const client = await theClient();
  const db = client.db(dbName);
  const companies = db.collection('companies');
  return companies;
}

async function all() {
  let results = await collection();
  return results.find({}).sort([['name', -1]]);
}

async function printAll() {
  let cursor = await all();
  let results = [];
  await cursor.forEach(startup => {
    console.log(startup.name)
    results.push({ name: startup.name });
  });
  return results;
}