/*
 TODO:
  use cache for summaries
  deal with duplicates in a smart way
  categories
  deal with bogus addresses
  layering (or something) so bogus data doesn't overwrite corrections on the next import
*/

"use strict";

require("dotenv").config();
const moment = require("moment");
const assert = require("assert");
const CompanyStore = require("./server/companyStore");
const Company = require("./server/company");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const crunchKey = process.env.CRUNCH_KEY;

let dbUrl
if (process.argv.slice(2) === 'dev') {
  console.log('DEV')
  dbUrl = process.env.MONGO_URI || `mongodb://localhost:27017/startup-vt`
} else {
  dbUrl = process.env.MONGOLAB_MAUVE_URI
}
console.log(dbUrl)
let store = new CompanyStore(dbUrl);
const importsDir = "./imports";

importAll();

function summariesUrl(pageNumber) {
  return `https://api.crunchbase.com/v3.1/organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`;
}

async function importAll() {
  await store.deleteAll();

  createDir(importsDir);

  let summaries = await getSummaries();
  console.log(`Found ${summaries.length} summaries`);
  for (let summary of summaries) {
    assert.ok(summary.properties);

    console.log(`=== ${summary.properties.name}`);
    let details = await getDetails(summary);
    if (details) {
      let company = await Company.fromCrunchBase(summary, details.data);
      console.log("\tinserting " + company.name)
      await store.add(company);
    }
  }
}

function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}

function readJson(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(JSON.parse(data));
    });
  });
}

function writeJson(path, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, JSON.stringify(data, null, 2), err => {
      err ? reject(err) : resolve();
    });
  });
}

async function getSummaries() {
  let summariesFile = path.join(importsDir, `_summaries.json`);
  try {
    let fileStats = fs.statSync(summariesFile);
    let earlyThisMorning = moment().startOf("day");
    let fileModified = moment(new Date(fileStats.mtime));
    let fileChangedToday = fileModified >= earlyThisMorning;
    //console.log(`Changed today? ${fileChangedToday}  (${fileModified})`);
    // if the file was already fetched today, use the cached version
    if (fileChangedToday) {
      console.log("Using cached summaries");
      return await readJson(summariesFile);
    }
  } catch (err) {
    // if the file does not exist, that's cool, fall through and fetch it
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  // fetch all Vermont company summaries from Crunchbase API
  let summaries = await fetchAllSummaries();
  writeJson(summariesFile, summaries);
  return summaries;
}

async function fetchAllSummaries() {
  let pageNumber = 1;
  let summaries = [];
  let keepFetching = true;
  while (keepFetching) {
    await sleep(1000);

    const url = summariesUrl(pageNumber);
    console.log(`Fetching summaries, page ${pageNumber}`);
    let response = await fetch(url);
    let payload = await response.json();

    if (!payload || !payload.metadata || payload.data.items.length === 0) {
      console.error(`No payload for page ${pageNumber}`);
      keepFetching = false;
      break;
    } else if (pageNumber >= payload.data.paging.number_of_pages) {
      keepFetching = false;
    }

    summaries = summaries.concat(payload.data.items);
    pageNumber += 1;
  }
  return summaries;
}

// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDetails(summary) {
  const slug = summary.properties.permalink;
  const detailsFile = path.join(importsDir, `${slug}.json`);
  let details = null;

  if (fs.existsSync(detailsFile)) {
    console.log(`\t${slug} found in cache`);
    details = await readJson(detailsFile);
    let cacheUpdated = details.data.properties.updated_at;
    let summaryEntryUpdated = summary.properties.updated_at;
    if (summaryEntryUpdated !== cacheUpdated) {
      console.log(
        `\t${slug} updated in Crunchbase (${summaryEntryUpdated} vs ${cacheUpdated})`
      );
      details = null; // force a re-fetch
    }
   
  }

  if (details === null) {
    let url = `https://api.crunchbase.com/v3.1/organizations/${slug}?user_key=${crunchKey}`;
    console.log(`\tfetching ${slug}`);
    let response = await fetch(url);
    let details = await response.json();
    if (!details.data || !details.data.properties) {
      console.log(`${slug} had bogus data in API call; skipping`);
      console.log({ details });
      return null;
    }

    writeJson(detailsFile, details);
  }

  // move to object?
  if (details && tooOld(details)) {
    console.log(
      `\t${slug} too old; skipping (${details.data.properties.founded_on})`
    );
    return null;
  }
  return details;
}

// should "too old" go into the Company object instead?
function tooOld(details) {
  // todo: use now minus 20 years, not 2000-01-01
  return moment(details.data.properties.founded_on) < moment("2000-01-01");
}
