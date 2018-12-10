import React, { Component } from 'react';
import './Tag.css';

class Tag extends Component {

  render() {
    //console.log("tag js" + this.props.tag)

    return(
      <div className={"industry " + this.props.tag}> {this.props.tag} </div>
    )
  };
}

export default Tag;