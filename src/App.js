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
      totalFunding: 20
    };
  }
  componentDidMount() {
    fetch(`/startups`)
      .then(response => response.json())
      .then(data => this.setState({ startups: data }))
      .catch(() => this.setState({ status: "Failed to fetch content" }));
    //this.setState({ totalFunding: this.calcTotalFunding})  
    console.log('startups', this.state.startups)
    this.setState({ totalFunding: this.calcTotalFunding() })
  }

  updateState = (startup) => {
    //console.log(event);
    this.setState({ current: startup })
  }
  calcTotalFunding = () => {
    console.log('startups2', this.state.startups)
    let fundingArray = this.state.startups.map(company => company.total_funding);
    let sum = 0;
    for (let i = 0; i < fundingArray.length; i++) {
      sum += fundingArray[i]
    }
    console.log('sum: ', sum)

    //let fundingArray = this.state.startups.map(company => company.total_funding_usd);
    //fundingArray.filter(funds => funds > 0)
    //console.log("funding array is")
    //console.log(fundingArray)

    //let total = fundingArray.reduce((accumulator, currVal)=>accumulator+currVal);
    //console.log(total)

    //this is a test
    return sum;
    //this.setState({ totalFunding: total})
  }

  render() {
    if (this.state.startups.length > 0) {
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
    } else {
      return <div></div>
    }
  }
}

export default App;
