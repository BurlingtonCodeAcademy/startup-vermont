import React, { Component } from 'react';
import './Tag.css';

class Tag extends Component {
  
  render() {

    return(
      <div className={"industry " + this.props.tag}> {this.props.tag} </div>
    )
  };
}

export default Tag;