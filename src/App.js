import React, { Component } from 'react';
import logo from './logo.svg';
import Startup from './Startup.js';
import Map from './Map.js';
import './App.css';



class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          startup-vermont
        </header>
        <div id="grid-container">
          <div id="startup-list">
          <h1>Startups in VT:</h1>
            <Startup />
            <Startup />
            <Startup />
            <Startup />
            <Startup />
            <Startup />
            <Startup />
            <Startup />
          </div>

          <div id="startup-map">
            <Map />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
