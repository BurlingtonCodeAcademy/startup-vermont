import React, { Component } from 'react';
import './Startup.css';
import Tag from './Tag.js'


class Startup extends Component {
  render() {

    return (
      <div className="startup-info">
        <a href={this.props.website}><img src={this.props.logo_url}></img></a><h1 className="startup-names">{this.props.name.toUpperCase()}</h1>
        <p>
          <i><strong>{this.props.short_description.toLowerCase()}</strong></i>
          <br />
        </p>
        <p>
          {this.props.city}, Vermont
          <br />
        </p>
        <p>
          {this.props.industries.map(tag => {
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