import React, { Component } from 'react';
import './Profile.css';


class Profile extends Component {

  render() {
    console.log(this.props)
    if (this.props.startup) {
      return (
        <div className="profile">
          <a href={this.props.website}><img className="logo-profile" src={this.props.startup.logo_url} alt="logo"></img></a>
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
            <i>{this.props.startup.short_description}</i>
          </div>
          <br />

          <div className="info-profile">
            {this.props.startup.num_employees_max && "Team size: " + this.props.startup.num_employees_min + " - " + this.props.startup.num_employees_max && <br />}
            Year founded: {this.props.startup.founded_year || this.props.startup.founded_year} <br />
            Funding: {this.props.startup.total_funding_usd || "Not reported"}
          </div>


        </div>
      )
    } else {
      return (
        <div>
          Startup Info Here if no startup clicked
        </div>
      )
    }
  }
}

export default Profile;