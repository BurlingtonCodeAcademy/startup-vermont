const assert = require('assert')
const moment = require('moment')

const fetch = require('node-fetch');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Company {
    static async fromCrunchBase(summary, details) {
        let company = new Company()
        company.fromOrganizationSummary(summary);
        await company.fromOrganizationDetails(details);
        return company;
    }

    async fromLaunchVt(row) {
        this.modified_at = row['Timestamp']
        this.name = row['Business name (please include the name you used during LaunchVT if your name has changed)']
        // 'Is your business still operational?': '',
        // 'Contact person\'s name': '',

        this.founders = row['Founder\'s names and current email addresses']
            .split(',')
            .map((founder_name) => { return { last_name: founder_name } })

        // 'Management team (name and title)': '',

        this.address = { street_1: row['Current location of the business (please list past locations for you business if you have moved)'] }
        this.num_employees_min = row['Current number of employees (including founders/executives)']
        this.num_employees_max = row['Current number of employees (including founders/executives)']

        // 'Annual revenue for 2017 (this will be kept confidential and only used to create an aggregate number for all Alumni)': '$4,993,200.00',
        this.total_funding_usd = row['Total follow on funding after LaunchVT'] // this is a formatted string and will probably break

        // 'List any acceleration or mentorship programs you participated in after LaunchVT': '',
        // 'List and rank your top three current or past challenges to growing your business in Vermont': '',
        // 'List and rank the top three things LaunchVT could do to support entrepreneurs during it\'s 8 week program': { '': '' },
        // 'Which of the services the LaunchVT provided were most valuable to you?': '',
        // '(Optional) If your business has left Vermont or is considering leaving Vermont, what could LaunchVT do to help you stay in the state?': '',
        // '(Optional) Please indicate your interest in participating in the following programs that LaunchVT is exploring': { '': '' },
        // '(Optional) Please share a testimonial quote about LaunchVT that we can use to promote the program': { '': '' } } ]

        this.latlong = await this.getLatlong(this.address.street_1, 'Vermont')

    }

    async getLatlong(address, city) {

        let responseText;

        if (address) {
            await sleep(1000)
            address = address.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')
            city = city.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(' ').join('%20')

            let osmUrl = "https://nominatim.openstreetmap.org/search?q=" + address + "%20" + city + "%20vermont&format=json"
            // console.log(osmUrl)  
            let homeUrl = 'https://the-startup-report.herokuapp.com/'
            try {
                var response = await fetch(osmUrl, { headers: { Referer: homeUrl } })

                if (response) {
                    responseText = await response.text()
                    let payload = JSON.parse(responseText)
                    if (payload.length > 0) {
                        if (!payload[0]) { return null }
                        let latlong = [payload[0].lat, payload[0].lon]
                        return latlong
                    }
                }
            } catch (err) {
                console.log(err.message)
                if (responseText) {
                    console.log(responseText)
                }
            }
        }
    }

    fromOrganizationSummary(organizationSummary) {
        let properties = organizationSummary.properties;
        this.name = properties.name;
        this.crunchbaseUuid = organizationSummary.uuid;
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
        this.founders = organizationDetails.relationships.founders.items.map(item => item.properties)
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
        this.latlong = await this.getLatlong(address, city)
    }

}

module.exports = Company;