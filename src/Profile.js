import React, { Component } from 'react';
import './Profile.css';
import Tag from './Tag.js'


class Profile extends Component {

  render() {
  

    if (this.props.startup) {
      let categoryArea;
    if(this.props.startup.categories){
      categoryArea = this.props.startup.categories.map(tag => {
        return <Tag key={tag} tag={tag} startups={this.props.startups} filterByTag={this.props.filterByTag}/>;
      })
    } else {
      categoryArea = <div></div>
    }
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
          <b>Team size:</b> {this.props.startup.num_employees_max && 
            (this.props.startup.num_employees_min.toLocaleString() + " - " +
             this.props.startup.num_employees_max.toLocaleString()) || 
            "Not reported"} <br />
            <b>Year founded:</b> {this.props.startup.founded_on || 
            "Not reported"} <br />
            {console.log(this.props.startup.founders)}
            <b>Founders:</b> {(this.props.startup.founders.length > 0) ?
              (this.props.startup.founders.map(founder => 
                [founder.first_name, founder.last_name].join(' ')).join(' | ')) : 
              "Not reported"} 
              <br />
          </div>
          
          <div className="funding">
          <b>Funding: </b> {
            (this.props.startup.total_funding_usd === 0) ? 
              "Not reported" :
              '$' + this.props.startup.total_funding_usd.toLocaleString()
          } <br />
          </div>
          <div className='profile-categories'>
          {categoryArea}

          </div>

        </div>
      )
    } else {
      return (
        <div>
        </div>
      )
    }
  }
}

export default Profile;
