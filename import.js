require('dotenv').config();

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const MongoClient = require('mongodb').MongoClient;
const dbName = 'startup-vt';

const dbUrl = process.env.MONGO_URI || process.env.MONGOLAB_MAUVE_URI || `mongodb://localhost:27017/${dbName}`

let connection = null;

importAll();

async function importAll() {

  const importsDir = './imports';
  try {
    fs.mkdirSync(importsDir)
  } catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
  }

  let pageNumber = 1
  let crunchKey = process.env.CRUNCH_KEY
  let crunchUrl = `https://api.crunchbase.com/v3.1/organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`
  let odmUrl = `https://api.crunchbase.com/v3.1/odm-organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`

  fetch(crunchUrl)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      let itemsRemoved = 0
      let objectsArray = []

      console.log({ received: data.metadata })

      fs.writeFile(path.join(importsDir, 'organizations.json'), JSON.stringify(data, null, 2), (err => {
        if (err) {
          console.log(err);
          process.exit(1);
        }
      }))

      meta = data.metadata
      let count = 0
      for (let company of data.data.items.slice(0, 10)) {
        let companyObject = {
        }
        if (!company.properties) {
          itemsRemoved++
          return console.log(company.name + ' No properties value')
        }
        companyObject.name = company.properties.name
        companyObject.short_description = company.properties.short_description
        companyObject.website = company.properties.homepage_url
        companyObject.logo_url = company.properties.profile_image_url
        let apiPath = company.properties.api_path
        console.log(`https://api.crunchbase.com/v3.1/` + apiPath + `?user_key=${crunchKey}`)


        fetch(`https://api.crunchbase.com/v3.1/` + apiPath + `?user_key=${crunchKey}`)
          .then((response) => {
            return response.json()
          })
          .then((companyInfo) => {
            if (!companyInfo.data || !companyInfo.data.properties || !companyInfo.data.relationships) {
              itemsRemoved++
              // return console.log(itemsRemoved + ' No properties value')
              next;
            }
            count += 1

            fs.writeFile(path.join(importsDir,
              `${company.properties.permalink}.json`),
              JSON.stringify(companyInfo, null, 2), err => {
                if (err) {
                  console.log(err);
                }
              });

            let properties = companyInfo.data.properties
            let addressLocation = companyInfo.data.relationships.offices.item.properties
            let categoriesSection = companyInfo.data.relationships.categories
            // dataDiv.innerHTML += 'Num employees min: ' + JSON.stringify(properties.num_employees_min) + '<br>'
            // dataDiv.innerHTML += 'Num employees max: ' + JSON.stringify(properties.num_employees_max) + '<br>'
            // dataDiv.innerHTML += 'Founded on: ' + JSON.stringify(properties.founded_on) + '<br>'
            // dataDiv.innerHTML += 'Total funding: ' + JSON.stringify(properties.total_funding_usd) + '<br>'
            // dataDiv.innerHTML += 'Categories: ' + JSON.stringify(categoriesSection.items[0].properties.category_groups) + '<br>'
            // dataDiv.innerHTML += 'Address: ' + JSON.stringify(addressLocation.street_1) + ' <br>City: '+ JSON.stringify(addressLocation.city) +'<br>'

            if (!categoriesSection.items[0] || !categoriesSection.items[0].properties) {
              itemsRemoved++
              return console.log(itemsRemoved + ' No properties value')
            }

            companyObject.num_employees = properties.num_employees_min + '-' + properties.num_employees_max
            companyObject.date_founded = properties.founded_on
            companyObject.funding = properties.total_funding_usd
            companyObject.industries = categoriesSection.items[0].properties.category_groups
            companyObject.address = addressLocation.city + ' VT'
            companyObject.founders = companyInfo.data.relationships.founders.items
            objectsArray.push(companyObject)

            console.log(companyObject)
            addCompany(companyObject)

            // console.log(objectsArray)
          })
      }
    })
}

async function addCompany(companyObject) {

  let collection = await companies()
  console.log("inserting " + companyObject.name)
  collection.insertOne(companyObject)

}


function closeConnection() {
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
