const assert = require('assert')
const moment = require('moment')

class Company {

    // constructor(summary, details) {
    //     this.fromOrganizationSummary(summary)
    //     this.fromOrganizationDetails(details)
    // }

    // geoLocate() {
    //     let latlon = fetch(something)
    //     this.latitude = latlon[0]
    //     this.longitude = latlon[1]
    // }

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

    fromOrganizationDetails(organizationDetails) {
        assert.equal(organizationDetails.uuid, this.crunchbaseUuid, "UUIDs should match")
        let properties = organizationDetails.properties

        assert.equal(organizationDetails.relationships.offices.cardinality, 'OneToOne', 'found a company with several offices -- must write code to handle this')
        this.address = organizationDetails.relationships.offices.item.properties;

        this.num_employees_min = properties.num_employees_min
        this.num_employees_max = properties.num_employees_max

        this.founded_on = (properties.founded_on === null ? properties.founded_on : moment(properties.founded_on).format('YYYY'))

        this.total_funding_usd = properties.total_funding_usd
        this.founders = organizationDetails.relationships.founders.items

        // TODO
        //this.categories = []

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
  /*      
                this.categories = organizationDetails.relationships.categories.items.map(item => {            
                    return item.properties.category_groups
                });
        
     this.categories.append(organizationDetails.properties.)
*/

    }

}

module.exports = Company;