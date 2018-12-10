import React, { Component } from 'react';
//import './Profile.css';


class Profile extends Component {
  
  render() {
    return(
      <div className="profile">
        {this.props.name}
        <a href={this.props.website}><img src={this.props.logo_url}></img></a>
      </div>
    )
  }
}

  export default Profile;