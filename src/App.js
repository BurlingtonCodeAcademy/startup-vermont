import React, { Component } from 'react';
//import logo from './logo.svg';
import Startup from './Startup.js';
import Map from './Map.js';
import './App.css';



class App extends Component {
  constructor() {
    super();
    this.state = {
      startups: []
    };
  }
  componentDidMount() {
    fetch(`/startups`)
      .then(response => response.json())
      .then(data => this.setState({ startups: data }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          startup-vermont
        </header>
        <div id="grid-container">
          <div id="startup-list">
          <h1>Startups in VT:</h1>
            {this.state.startups.map(startup => {
              //console.log(startup);
              let result = <Startup key={startup._id} {...startup} />
              return result;
            })}
          </div>

          <div id="startup-map">
            <Map startups={this.state.startups}/>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
