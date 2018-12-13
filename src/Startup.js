import React, { Component } from "react";
import "./Startup.css";
import Tag from "./Tag.js";
import RedButton from "./RedButton.js";
import vermontLogo from './vermontFavicon.svg'

class Startup extends Component {

  render() {
    let categoriesArea;
    if(this.props.startup.categories){
      categoriesArea = this.props.startup.categories.map(tag => {
        return <Tag key={tag} tag={tag} startups={this.props.startups} filterByTag={this.props.filterByTag}/>;
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
    // if (this.props.startup.logo_urllink.slice(42,46) === 'http') {
                
    // }
    return (
      <div id="startup-container">  
        <div>
          {curatorButton}
          </div>   
        <div className="startup-info" onClick={() => this.props.updateState(this.props.startup)}>
          <a href={this.props.startup.website}>
            {this.props.startup.logo_url && this.props.startup.logo_url.slice(42,46) !== 'http'? 
            <img className="logo" src={this.props.startup.logo_url} alt="logo with link to website" /> :
            <img className="logo" src={vermontLogo} alt="logo with link to website" />
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
