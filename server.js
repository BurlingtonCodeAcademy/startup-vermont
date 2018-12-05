require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const dbUrl = process.env.MONGO_URI || process.env.MONGOLAB_MAUVE_URI || "mongodb://localhost:27017/startup-vermont"

console.log("Hello")

const MongoClient = require('mongodb').MongoClient;
async function connect(dbUrl) {
  console.log(`Connecting to ${dbUrl}...`)
  let dbClient = await MongoClient.connect(dbUrl, { useNewUrlParser: true })
  console.log("Connected to database.");
  console.log(dbClient.isConnected())
}
connect(dbUrl);

app.use(express.static('build'))

app.get('/test', (request, response) => {
  response.send(process.env.TEST)
})

app.listen(port, () => console.log(`Server listening on port ${port}!`))