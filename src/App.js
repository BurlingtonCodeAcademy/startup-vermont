import React, { Component } from 'react';
//import logo from './logo.svg';
import Startup from './Startup.js';
import BigMap from './BigMap.js';
import Profile from './Profile.js';
import Totals from './Totals.js';
import Login from './Login.js';
import './App.css';




class App extends Component {
  constructor() {
    super();
    this.state = {
      startups: [],
      current: null,
      totalFunding: '?',
      username: '',
      password: '',
      isLoggedIn: false
    };
    this.secretPassword = 'launchvt';
  }
  componentDidMount() {
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
  handleFormChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (this.state.password === this.secretPassword) {
      this.setState({ isLoggedIn: true });
      alert("Welcome!")
    }
    console.log(this.state.isLoggedIn)
  }

  render() {
    let loginForm;
    if (this.state.isLoggedIn === false) {
      loginForm = <Login onChange={this.handleFormChange} onSubmit={this.handleFormSubmit} />
    } else if (this.state.isLoggedIn === true) {
      loginForm = <p>Welcome, {this.state.username}!</p>
    }
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
              let result = <Startup isLoggedIn={this.state.isLoggedIn} key={startup._id} {...startup} updateState={this.updateState} />
              return result;
            })}
          </div>

          <div id="startup-map">
            <BigMap startups={this.state.startups} />
          </div>

        <div id="startup-info">
          <Profile startup={this.state.current} />
        </div>

        <div className="login-bar">
          {loginForm}
        </div>

      </div>
      </div>

    );
  }
}

export default App;
