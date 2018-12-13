import React, { Component } from 'react';
import './Tag.css';

class Tag extends Component {

  render() {
    return(
      <div className={"industry " + this.props.tag} onClick={this.props.filterByTag}> {this.props.tag} </div>
    )
  };
}

export default Tag;