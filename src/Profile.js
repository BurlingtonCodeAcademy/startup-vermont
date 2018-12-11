import React, { Component } from 'react';
import './Profile.css';


class Profile extends Component {

  render() {
    console.log(this.props)
    if (this.props.startup) {
      return (
        <div className="profile">

          <div className="title"><b>
            {this.props.startup.name}</b>
          </div>

          <div className="location">
          {(this.props.startup.address.street_1 != null && this.props.startup.address.street_1.toLowerCase() != 'vermont') &&  this.props.startup.address.street_1 + ", "}
          {(this.props.startup.address.street_2 != null && this.props.startup.address.street_2.toLowerCase() != 'vermont') &&  this.props.startup.address.street_2 + ", "}          
          {this.props.startup.address.city}, VT
            <br /> <br />
          </div>

          <br />
          <div className="description">
            {this.props.startup.short_description}
          </div>
          <br />

          <div className="info-profile">
          <b>Team size:</b> {this.props.startup.num_employees_max && (this.props.startup.num_employees_min + " - " + this.props.startup.num_employees_max) || "Not reported"} <br />
            <b>Year founded:</b> {this.props.startup.founded_year || "Not reported"} <br />
            <b>Founders:</b> {this.props.startup.founders[0]? this.props.startup.founders.map(founder => founder.properties.first_name +" "+founder.properties.last_name +' |  ' + '\n'): "Not reported"} <br />
          </div>
          
          <div className="funding">
          <b>Funding:</b> {this.props.startup.total_funding_usd || "Not reported"} <br />
          {console.log(this.props.startup)}
          </div>


        </div>
      )
    } else {
      return (
        <div className = 'totals'>
          <b>Startups in VT: {this.props.totalNumberStartups}</b>
        </div>
      )
    }
  }
}

export default Profile;
