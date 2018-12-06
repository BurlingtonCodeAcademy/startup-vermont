require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const dbName = 'startup-vt';

const dbUrl = process.env.MONGO_URI || process.env.MONGOLAB_MAUVE_URI || `mongodb://localhost:27017/${dbName}`

let connection = null;

app.use(express.static('build'))

app.get('/startups', async (request, response, closeConnection) => {
  const results = await startups();
  console.log({ results });
  response.send(results);
  closeConnection();
})

app.listen(port, () => console.log(`Startup-Vermont app listening on port ${port}!`));

function closeConnection () {
  console.log('CLOSE CONNECTION')
  connection.close();
}
// Open (or reuse) a connection to the database and
// return the MongoDB Client.
async function theClient() {
  console.log('calling client')
    // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
    console.log(`Connecting to ${dbUrl}...`);
    if (connection) {
      return connection;
    } else {
      connection = await MongoClient.connect(
        dbUrl,
        { useNewUrlParser: true }
      );
      console.log("Connected to database.");
      return connection;  
    }
};

async function companies() {
  const client = await theClient();
  const db = client.db(dbName);
  const companies = db.collection('companies');
  return companies;
}

async function all() {
  let results = await companies();
  return results.find({}).sort([['name', 1]]);
}

async function startups() {
  let cursor = await all();
  let results = [];
  // todo: use CompanyStore and Company objects
  await cursor.forEach(startup => {
    results.push({
      name: startup.name, 
      address: startup.address, 
      city: startup.city,
      short_description: startup.short_description, 
      industries: startup.industries, 
      website: startup.website, 
      logo_url: startup.logo_url,
      _id: startup._id
    });
      
  });
  return results;
}
