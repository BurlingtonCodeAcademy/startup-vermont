import React, { Component } from "react";
import "./Startup.css";
import Tag from "./Tag.js";
import RedButton from "./RedButton.js";

class Startup extends Component {

  render() {
    let categoriesArea;
    if(this.props.startup.categories){
      categoriesArea = this.props.startup.categories.map(tag => {
        return <Tag key={tag} tag={tag} />;
      })
    } else {
      categoriesArea = <div></div>
    }
    let curatorButton;
    if (this.props.isLoggedIn === true) {
      curatorButton = <RedButton startup={this.props.startup} handleClick={this.props.handleClick} />
    } else {
      curatorButton = <div></div>
    }

    return (
      <div id="startup-container">
        <div className="startup-button">
          {curatorButton}
        </div>
        <div className="startup-info" onClick={() => this.props.updateState(this.props.startup)}>
          <a href={this.props.startup.website}>
            {this.props.startup.logo_url &&
              <img className="logo" src={this.props.startup.logo_url} alt="logo" />
            }
          </a>

          <h1 className="startup-names">{this.props.startup.name.toUpperCase()}</h1>

          <p>
            <i>{this.props.startup.short_description}</i>
            <br />
          </p>
          <p className="address-info">
            {this.props.startup.address.city}
            <br />
          </p>
          <div className="category-container">
            {categoriesArea}
            <br />
          </div>
        </div>
      </div>

    );
  }
}

export default Startup;
