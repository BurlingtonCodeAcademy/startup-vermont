require('dotenv').config();

/*
 TODO:
  pagination
  use cache
  deal with duplicates in a smart way
  categories
  deal with bogus addresses
  layering (or something) so bogus data doesn't overwrite corrections on the next import
*/
const CompanyStore = require('./server/companyStore')
const Company = require('./server/company')
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const dbUrl = process.env.MONGO_URI || process.env.MONGOLAB_MAUVE_URI || `mongodb://localhost:27017/startup-vt`

let store = new CompanyStore(dbUrl);

importAll();

async function importAll() {

  await store.deleteAll();

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
    .then((payload) => {
      if (!payload || !payload.metadata) {
        console.error('No metadata :-( ')
        process.exit(1);
      }
      // console.log({ received: payload.metadata })

      let itemsRemoved = 0
      let objectsArray = []
      

      fs.writeFile(path.join(importsDir, 'organizationSummaries.json'),
        JSON.stringify(payload, null, 2),
        (err) => {
          if (err) {
            console.log(err);
            process.exit(1);
          }
        });

      for (let organizationSummary of payload.data.items) {
        if (!organizationSummary.properties) {
          itemsRemoved++
          return console.log(organizationSummary.name + ' No properties value')
        }

        let company = new Company()
        company.fromOrganizationSummary(organizationSummary);

        setTimeout(()=>{
          importDetails(company, crunchKey, importsDir, organizationSummary, objectsArray);
        }, 1000);
      }
    })
}

function importDetails(company, crunchKey, importsDir, organizationSummary, objectsArray) {
  console.log(`https://api.crunchbase.com/v3.1/` + company.apiPath + `?user_key=${crunchKey}`);
  fetch(`https://api.crunchbase.com/v3.1/` + company.apiPath + `?user_key=${crunchKey}`)
    .then((response) => {
      return response.json();
    })
    .then((companyInfo) => {
      if (!companyInfo.data || !companyInfo.data.properties || !companyInfo.data.relationships) {
        itemsRemoved++;
        // return console.log(itemsRemoved + ' No properties value')
        next;
      }
      fs.writeFile(path.join(importsDir, `${organizationSummary.properties.permalink}.json`), JSON.stringify(companyInfo, null, 2), err => {
        if (err) {
          console.log(err);
        }
      });
      company.fromOrganizationDetails(companyInfo.data);
      objectsArray.push(company);
      console.log(company);
      addCompany(company);
      // console.log(objectsArray)
    });
}

async function addCompany(companyObject) {
  let collection = await companies()
  console.log("inserting " + companyObject.name)
  collection.insertOne(companyObject)
}


async function companies() {
  return await store.collection();
}
