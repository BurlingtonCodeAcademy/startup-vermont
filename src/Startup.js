import React, { Component } from 'react';
import './Startup.css';

class Startup extends Component {
  render() {
    return (
      <div className="startup-info">
        <h1>Burlington Code Academy</h1>
        <h4>Burlington, VT</h4>
        <p>
          Coding Bootcamp
          <br /><br />
          <i>Educating future computer scientists in Javascript</i>
          <br /><br />
          <a href="www.burlingtoncodeacademy.com">website</a>
        </p>
      </div>
    )
  }
}

export default Startup;