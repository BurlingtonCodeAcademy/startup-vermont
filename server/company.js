const assert = require('assert')
const moment = require('moment')

class Company {

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
        
        this.founded_year = moment(properties.founded_on).year

        this.total_funding_usd = properties.total_funding_usd
        this.founders = organizationDetails.relationships.founders.items

        // TODO
        //this.categories = []
        this.categories = organizationDetails.relationships.categories.items.map(item => {item.properties.category_groups});
        // this.categories.append(organizationDetails.properties.)


    }

}

module.exports = Company;