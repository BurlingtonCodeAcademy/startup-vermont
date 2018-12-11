/*
 TODO:
  use cache for summaries
  deal with duplicates in a smart way
  categories
  deal with bogus addresses
  layering (or something) so bogus data doesn't overwrite corrections on the next import
*/

"use strict";

require('dotenv').config();
const moment = require('moment')
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


async function importAll() {

  await store.deleteAll();

  const importsDir = './imports';
  createDir(importsDir);

  let summaries = await fetchAllSummaries();

  writeJson(path.join(importsDir, `_summaries.json`), summaries)

  for (let summary of summaries) {

    if (!summary.properties) {  // sanity check
      return console.log(summary.name + ' No properties value')
    }

    let company = new Company()
    company.fromOrganizationSummary(summary);

    setTimeout(() => {
      importDetails(company, crunchKey, importsDir, summary);
    }, 1000);
  }
}

function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  }
  catch (err) {
    if (err.code !== 'EEXIST') {
      throw err;
    }
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
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
      err ? reject(err) : resolve();
    });
  });
}

async function fetchAllSummaries() {
  let pageNumber = 1;
  let summaries = [];
  let keepFetching = true;
  while (keepFetching) {
    const url = summariesUrl(pageNumber);
    let response = await fetch(url)
    let payload = await response.json()

    if (!payload || !payload.metadata || payload.data.items.length === 0) {
      console.error(`No payload for page ${pageNumber}`)
      keepFetching = false;
      break;
    }
    else if (pageNumber >= payload.data.paging.number_of_pages) {
      keepFetching = false;
    }

    summaries = summaries.concat(payload.data.items)

    pageNumber += 1;
  }
  return summaries;
}

// TODO: refactor
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
  return;
}
