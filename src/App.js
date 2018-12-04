import React, { Component } from 'react';
import logo from './logo.svg';
import Startup from './Startup.js';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <div id="grid-container">
          <div id="startup-list">
            <Startup />
          </div>
          <div id="startup-map">
          </div>
        </div>
      </div>
    );
  }
}

export default App;
