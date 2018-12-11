import React, { Component } from "react";
import "./Startup.css";
import Tag from "./Tag.js";

class Startup extends Component {
  render() {
    return (
      <div
        className="startup-info"
        onClick={() => this.props.updateState(this.props)}
      >
        <a href={this.props.website}>
          {this.props.logo_url &&
            <img className="logo" src={this.props.logo_url} alt="logo" />
          }
        </a>

        <h1 className="startup-names">{this.props.name.toUpperCase()}</h1>
        <p>
          <i>{this.props.short_description}</i>
          <br />
        </p>
        <p className="address-info">
          {this.props.address.city}
          <br />
        </p>
        <div className="category-container">
          {this.props.categories &&
            this.props.categories.map(tag => {
              return <Tag key={tag} tag={tag} />;
            })}
          <br />
        </div>
      </div>
    );
  }
}

export default Startup;
