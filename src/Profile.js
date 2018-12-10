import React, { Component } from 'react';
import './Profile.css';


class Profile extends Component {

  render() {
    if (this.props.startup) {
      return (
        <div className="profile">
        <div className="title">
        {this.props.startup.name}
        </div>
        <div>{this.props.startup.address.city}
        </div>
        <div>
          {this.props.startup.short_description}
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