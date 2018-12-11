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
      current: null,
      totalFunding: '?'
    };
  }
  componentDidMount() {
    let fetchedData;
    fetch(`/startups`)
      .then(response => response.json())
      .then(data => {
        this.setState({ startups: data })
        this.setState({ totalFunding: this.calcTotalFunding(data) })
      })
      .catch(() => this.setState({ status: "Failed to fetch content" }));
    
  }

  updateState = (startup) => {
    this.setState({ current: startup })
  }

  calcTotalFunding = (data) => {
    let fundingArray = data.map(company => company.total_funding_usd).filter(funds => funds > 0);
    let sum = 0;
    for (let i = 0; i < fundingArray.length; i++) {
      sum += fundingArray[i]
      console.log('sum: ', sum)
    }
    console.log('# companies: ', fundingArray.length)
    return sum;
  }

  render() {
    console.log({render: this.state.startups})
    return (
      <div className="App">
        <header className="App-header">
          startup-vermont
          <Totals totalNumberStartups={this.state.startups.length} totalFunding={this.state.totalFunding} />
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
            <Profile startup={this.state.current} />
          </div>

        </div>
      </div>
    );
  }
}

export default App;
