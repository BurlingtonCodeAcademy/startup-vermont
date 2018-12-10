'use strict';

/*
NodeJS Mongo Driver docs and tutorial:
  https://mongodb.github.io/node-mongodb-native/
  http://mongodb.github.io/node-mongodb-native/3.1/tutorials/crud/
*/

const MongoClient = require('mongodb').MongoClient;

class CompanyStore {
    constructor(dbUrl) {
        this.dbUrl = dbUrl;
        this.dbClient = null;
        this.dbName = 'startup-vt';
    }

  // Open (or reuse) a connection to the database and 
  // return the MongoDB Client.
  async client() {
    if (this.dbClient && this.dbClient.isConnected()) {
      return this.dbClient;
    } else {
      // http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html
      console.log(`Connecting to ${this.dbUrl}...`)
      this.dbClient = await MongoClient.connect(this.dbUrl, { useNewUrlParser: true })
      console.log("Connected to database.");
      return this.dbClient;
    }
  }

  // Get the MongoDB Collection for this record type (facts).
  // Must be asynchronous because the database connection
  // might not currently be open.
  async collection() {
    const client = await this.client();
    const db = client.db(this.dbName);
    const collection = db.collection('companies');
    return collection;
  }

  // Get a sorted cursor for all facts.
  async all() {
    let collection = await this.collection()
    return collection.find({}).sort([['when', 1]]);
  }

  async deleteAll() {
    (await this.collection()).drop()
  }

  async add(company) {
    let collection = await this.collection()
    console.log("Inserting " + company.name)
    // todo: validate company type and fields?
    collection.insertOne(company)
  }

}

module.exports = CompanyStore;