import React, { Component } from 'react';
import './Startup.css';

class Startup extends Component {
  render() {
    return (
      <div className="startup-info">
        <h1 className="startup-names">{this.props.name}</h1>
        <p>{this.props.address}          
          <br />
          {this.props.industries}
          <br />
          <i>{this.props.short_description}</i>
          <br />
          <a href={this.props.website}>website</a>
        </p>
      </div>
    )
  }
}

export default Startup;