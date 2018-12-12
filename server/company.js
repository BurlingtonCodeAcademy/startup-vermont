const assert = require('assert')
const moment = require('moment')

const fetch = require('node-fetch');

class Company {
    static async fromCrunchBase(summary, details) {
        let company = new Company()
        company.fromOrganizationSummary(summary);
        await company.fromOrganizationDetails(details);
        return company;
    }

    // geoLocate() {
    //     let latlon = fetch(something)
    //     this.latitude = latlon[0]
    //     this.longitude = latlon[1]
    // }

    async getLatlong(address, city) {
        if (address) {
            address = address.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')
            city = city.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')

            let osmUrl = "https://nominatim.openstreetmap.org/search?q=" + address + "%20" + city + "%20vermont&format=json"
            // console.log(osmUrl)  

            let response = await fetch(osmUrl).catch(error => console.log(error))
            if (response) {
                let payload = await response.json()

                if (!payload[0]) { return null }
                let latlong = [payload[0].lat, payload[0].lon]
                return latlong
            }
        }
    }

    async getLatlong(address, city, name) {
        if (address) {
            address = address.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')
            city = city.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')

            let osmUrl = "https://nominatim.openstreetmap.org/search?q=" + address + "%20" + city + "%20vermont&format=json"
            // console.log(osmUrl)  

            let response = await fetch(osmUrl).catch(error => console.log(error))
            if (response) {
                let payload = await response.json()

                if (!payload[0]) { return null }
                let latlong = [payload[0].lat, payload[0].lon]
                return latlong
            }
        }
    }

    fromOrganizationSummary(organizationSummary) {
        this.crunchbaseUuid = organizationSummary.uuid;
        let properties = organizationSummary.properties;
        this.name = properties.name;
        this.short_description = properties.short_description;
        this.description = properties.description;
        this.website = properties.homepage_url;
        this.logo_url = properties.profile_image_url;
        this.apiPath = properties.api_path;
    }

    async fromOrganizationDetails(organizationDetails) {
        assert.equal(organizationDetails.uuid, this.crunchbaseUuid, "UUIDs should match")
        let properties = organizationDetails.properties

        assert.equal(organizationDetails.relationships.offices.cardinality, 'OneToOne', 'found a company with several offices -- must write code to handle this')
        this.address = organizationDetails.relationships.offices.item.properties;

        this.num_employees_min = properties.num_employees_min
        this.num_employees_max = properties.num_employees_max

        this.founded_on = (properties.founded_on === null ? properties.founded_on : moment(properties.founded_on).format('YYYY'))
        this.total_funding_usd = properties.total_funding_usd
        this.founders = organizationDetails.relationships.founders.items
        this.funding_rounds = organizationDetails.relationships.funding_rounds.items;
        // TODO
        // Refactor
        let industryArray = []
        let items = organizationDetails.relationships.categories.items
        items.forEach((item) => {
            if (item.properties) {
                industryArray.push(item.properties.name)
                if (item.properties.category_groups !== null) {
                    for (let group of item.properties.category_groups) {
                        industryArray.push(group)
                    }
                }
            }
        })
        this.categories = [...new Set(industryArray)]

        let address = organizationDetails.relationships.offices.item.properties.street_1
        let city = organizationDetails.relationships.offices.item.properties.city
<<<<<<< HEAD
        let name = properties.name
        this.latlong = await this.getLatlong(address, city, name)
=======
        this.latlong = await this.getLatlong(address, city)
>>>>>>> 36a2d7616dbcee70fcc4be73ce3b645a50f9580e
    }

}

module.exports = Company;