import React, { Component } from 'react';
import './Startup.css';

class Startup extends Component {
  render() {
    return (
      <div className="startup-info">
        <h1 className="startup-names">Burlington Code Academy</h1>
        <p>Burlington, VT          
          <br />
          Coding Bootcamp
          <br />
          <i>Educating future computer scientists in Javascript</i>
          <br />
          <a href="www.burlingtoncodeacademy.com">website</a>
        </p>
      </div>
    )
  }
}

export default Startup;