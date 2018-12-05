require('dotenv').config();

let pageNumber = 1
function getdata(changePage) {
  let dataDiv = document.getElementById('data')
  if (changePage == 'up') {
    pageNumber++
  } else if (changePage == 'down') {
    if (pageNumber > 1) {
      pageNumber--
    }
  }

  let crunchKey = process.env.CRUNCH_KEY // works!!

  let crunchUrl = `https://api.crunchbase.com/v3.1/organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`

  let odmUrl = `https://api.crunchbase.com/v3.1/odm-organizations?locations=vermont&page=${pageNumber}&items_per_page=200&user_key=${crunchKey}`

  fetch(odmUrl)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      let itemsRemoved = 0
      let objectsArray = []
      console.log(data.data)
      meta = data.metadata
      dataDiv.innerHTML = JSON.stringify(meta) + `<br> Page ${pageNumber}: <br><br>`
      index = 1
      for (let company of data.data.items) {
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



        dataDiv.innerHTML += '<div>Name: ' +
          JSON.stringify(company.properties.name) +
          '<br>Description: ' + JSON.stringify(company.properties.short_description) +
          '</div><br>'
        let apiPath = company.properties.api_path
        console.log(`https://api.crunchbase.com/v3.1/` + apiPath + `?user_key=${crunchKey}`)
        fetch(`https://api.crunchbase.com/v3.1/` + apiPath + `?user_key=${crunchKey}`)
          .then((response) => {
            return response.json()
          })
          .then((companyInfo) => {
            if (!companyInfo.data || !companyInfo.data.properties || !companyInfo.data.relationships) {
              itemsRemoved++
              return console.log(itemsRemoved+' No properties value')
            }
            let properties = companyInfo.data.properties
            let addressLocation= companyInfo.data.relationships.offices.item.properties
            let categoriesSection = companyInfo.data.relationships.categories
            // dataDiv.innerHTML += 'Num employees min: ' + JSON.stringify(properties.num_employees_min) + '<br>'
            // dataDiv.innerHTML += 'Num employees max: ' + JSON.stringify(properties.num_employees_max) + '<br>'
            // dataDiv.innerHTML += 'Founded on: ' + JSON.stringify(properties.founded_on) + '<br>'
            // dataDiv.innerHTML += 'Total funding: ' + JSON.stringify(properties.total_funding_usd) + '<br>'
            // dataDiv.innerHTML += 'Categories: ' + JSON.stringify(categoriesSection.items[0].properties.category_groups) + '<br>'
            // dataDiv.innerHTML += 'Address: ' + JSON.stringify(addressLocation.street_1) + ' <br>City: '+ JSON.stringify(addressLocation.city) +'<br>'
          
            if (!categoriesSection.items[0] || !categoriesSection.items[0].properties) {
              itemsRemoved++
              return console.log(itemsRemoved+' No properties value')
            }

            companyObject.num_employees = properties.num_employees_min + '-' + properties.num_employees_max
            companyObject.date_founded = properties.founded_on
            companyObject.funding = properties.total_funding_usd
            companyObject.industries = categoriesSection.items[0].properties.category_groups
            companyObject.address = addressLocation.city + ' VT'
            companyObject.founders = companyInfo.data.relationships.founders.items
            objectsArray.push(companyObject)

            addCompany(companyObject)

            // console.log(objectsArray)
          })
      }
    })
}

async function addCompany(companyObject) {

  
}

