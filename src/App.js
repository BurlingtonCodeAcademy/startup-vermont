import React, { Component } from 'react';
//import logo from './logo.svg';
import Startup from './Startup.js';
import StartupsMap from './BigMap.js';
import Profile from './Profile.js';
import Totals from './Totals.js'
import './App.css';




class App extends Component {
  constructor() {
    super();
    this.state = {
      startups: [],
      current: null
    };
  }
  componentDidMount() {
    fetch(`/startups`)
      .then(response => response.json())
      .then(data => this.setState({ startups: data }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
  }
  updateState = startup => {
    //console.log(event);
    this.setState({ current: startup })
  }



  render() {
    if (this.state.startups.length > 0) {
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
              let result = <Startup key={startup._id} {...startup} updateState={this.updateState} />
              return result;
            })}
          </div>
          <div id="startup-map">
            <StartupsMap startups={this.state.startups} />
          </div>


          <div id="startup-info"> 
          <Profile startup={this.state.current} totalNumberStartups = {this.state.startups.length} />
          </div>

          </div>
        </div>
      );
    } else {
      return <div></div>
    }
  }
}

export default App;
