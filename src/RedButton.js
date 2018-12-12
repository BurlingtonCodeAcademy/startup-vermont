import React, { Component } from "react";
import "./RedButton.css";

class RedButton extends Component {

  render() {
    return(
      <div className="red-button" onClick={()=>this.props.handleClick(this.props.startup)}>X</div>
    )
  }
}

export default RedButton;