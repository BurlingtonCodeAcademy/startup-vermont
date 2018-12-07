import React, { Component } from 'react';
import './Startup.css';
import Tag from './Tag.js'


class Startup extends Component {
  render() {

    return (
      <div className="startup-info">
        <a href={this.props.website}><img src={this.props.logo_url}></img></a>
        <h1 className="startup-names">{this.props.name.toUpperCase()}</h1>
        <p>
          <i>{this.props.short_description}</i>
          <br />
        </p>
        <p className="address-info">
          {/*{this.props.address.street_1}<br />
          {this.props.address.street_2}<br />*/}
          {this.props.address.city}
          <br />
        </p>
        <p>
          {this.props.categories && this.props.categories.map(tag => {
            console.log('tag:' + tag)
            return <Tag tag={tag} />
          })}
          <br />
        </p>
      </div>
    )
  }
}

export default Startup;