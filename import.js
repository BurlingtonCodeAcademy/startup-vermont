"use strict;"

require('dotenv').config();
const moment = require('moment')

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

const crunchKey = process.env.CRUNCH_KEY
const dbUrl = process.env.MONGO_URI || process.env.MONGOLAB_MAUVE_URI || `mongodb://localhost:27017/startup-vt`
let store = new CompanyStore(dbUrl);

importAll();

function summariesUrl(pageNumber) {
  return `https://api.crunchbase.com/v3.1/organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`
}
// let odmUrl = `https://api.crunchbase.com/v3.1/odm-organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`


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

  let pageNumber = 1;
  let summaries = [];
  let keepFetching = true;
  while (keepFetching) {
    let response = await fetch(summariesUrl(pageNumber))
    let payload = await response.json()
    console.log(payload)

    if (!payload || !payload.metadata) {
      console.error('No metadata :-( ')
      keepFetching = false;
    }
    else if (pageNumber === payload.data.paging.number_of_pages) {
      keepFetching = false;
    }
    else {
      summaries = summaries.concat(payload.data.items)
    }
    pageNumber += 1;
  }

  writeJson(path.join(importsDir, `summaries.json`), summaries)

  for (let organizationSummary of summaries) {
    if (!organizationSummary.properties) {
      return console.log(organizationSummary.name + ' No properties value')
    }

    let company = new Company()
    company.fromOrganizationSummary(organizationSummary);

    setTimeout(() => {
      importDetails(company, crunchKey, importsDir, organizationSummary);
    }, 1000);
  }
}

function readJson(path) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
}

function writeJson(path, data) {
  console.log('writing')
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
      err ? reject(err) : resolve();
    });
  });
}

async function importDetails(company, crunchKey, importsDir, organizationSummary) {
  const slug = organizationSummary.properties.permalink;
  const detailsFile = path.join(importsDir, `${slug}.json`);

  if (fs.existsSync(detailsFile)) {
    let details = await readJson(detailsFile)
    let cacheUpdated = details.data.properties.updated_at
    let summaryEntryUpdated = organizationSummary.properties.updated_at

    // console.log({slug, summaryEntryUpdated, cacheUpdated})  // for debugging

    if (summaryEntryUpdated == cacheUpdated) {
      console.log(`Using ${slug}.json`)

      company.fromOrganizationDetails(details.data);
      await store.add(company);
      return;

    } else {
      console.log(`Updating ${slug}`)
    }
  } else {
    console.log(`Fetching ${slug}`)
  }

  console.log(`https://api.crunchbase.com/v3.1/` + company.apiPath + `?user_key=${crunchKey}`);
  let response = await fetch(`https://api.crunchbase.com/v3.1/` + company.apiPath + `?user_key=${crunchKey}`)
  let companyDetails = await response.json();
  if (!companyDetails.data || !companyDetails.data.properties || !companyDetails.data.relationships || moment(companyDetails.data.properties.founded_on) < moment('2000-01-01')) {
    return;
  }
  writeJson(detailsFile, companyDetails);

  company.fromOrganizationDetails(companyDetails.data);
  await store.add(company);
}
