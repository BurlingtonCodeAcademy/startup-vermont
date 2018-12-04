import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div id="grid-container">
          <div id="startup-list">
            <div class="startup-info">
            <h1>Burlington Code Academy</h1>
            <h4>Burlington, VT</h4>
            <p>
            Coding Bootcamp<br /><br />
            <i>Educating future computer scientists in Javascript</i></p>
            
            </div>
          </div>
          <div id="startup-map"></div>
        </div>
      </div>
    );
  }
}

export default App;
