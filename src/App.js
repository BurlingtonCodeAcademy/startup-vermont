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
      isLoggedIn: false,
      username: '',
      password: '',
      secretPassword: 'launchvt',
      startups: [],
      current: null,
      notStartups: [],
      filter: '',
      filteredStartups: [],
      totalFunding: '?',
    };
  }
  componentDidMount() {
    this.hydrateStateWithLocalStorage();
    window.addEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));

    if (localStorage.isLoggedIn === 'false') {
      console.log('fetching all data')
      fetch(`/startups`)
        .then(response => response.json())
        .then(data => {
          this.setState({ startups: data })
          this.setState({ filteredStartups: data })
          this.setState({ totalFunding: this.calcTotalFunding(data) })
        })
        .catch(() => this.setState({ status: "Failed to fetch content" }));
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
    this.saveStateToLocalStorage();
  }

  hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
      // if the key exists in localStorage
      if (localStorage.hasOwnProperty(key)) {
        // get the key's value from localStorage
        let value = localStorage.getItem(key);
        // parse the localStorage string and setState
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }
  saveStateToLocalStorage = () => {
    // for every item in React state
    for (let key in this.state) {
      // save to localStorage
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }

  updateState = (startup) => {
    if (this.state.current === null || startup != this.state.current) {
      this.setState({ current: startup })
    } else {
      this.setState({ current: null })
    }
  }

  calcTotalFunding = (data) => {
    let fundingArray = data.map(company => company.total_funding_usd).filter(funds => funds > 0);
    let sum = 0;
    for (let i = 0; i < fundingArray.length; i++) {
      sum += fundingArray[i]
    }
    console.log('# companies: ', fundingArray.length)
    return sum;
  }

  //todo: move to Login component?
  handleFormChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value })
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    if (this.state.password === this.state.secretPassword) {
      this.setState({ isLoggedIn: true });
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('username', username)
      alert(`Welcome ${username}!`)
    }
  }
  // adds startup to 'remove' array
  tempRemoveStartup = (startup) => {
    const { startups, notStartups } = this.state;

    this.setState({ notStartups: [...notStartups, startup] })
    localStorage.setItem('notStartups', JSON.stringify(notStartups))

    let filtered = startups.filter(f => f._id != startup._id);
    this.setState({ startups: filtered, filteredStartups: filtered })
    localStorage.setItem('startups', JSON.stringify(startups))

  }

  logout = () => {
    console.log('logging out')
    this.setState({ isLoggedIn: false });
    localStorage.clear();
    document.location.reload()
  }
  showAll = () => {
    this.setState({
      filteredStartups: this.state.startups,
      filter: ''
    })
    let searchForm = document.getElementById("search-form");
    console.log(searchForm)
    searchForm.value = "";
  }
  filterByTag = (e) => {
    e.preventDefault()
    e.stopPropagation();
    let tagName = e.target.className.substr(e.target.className.indexOf(' ') + 1)
    let filtered = [];
    this.state.filteredStartups.forEach(startup => {
      if (startup.categories.includes(tagName)) {
        filtered.push(startup)
      }
    });
    this.setState({ filter: tagName })
    this.setState({ filteredStartups: filtered })
  }
  handleSearch = (e) => {
    let newList = [];
    let containsTag;
    let searchTerm = e.target.value.toLowerCase();

    // searches by name and category
    if (e.target.value !== '') {
      this.state.startups.forEach(item => {
        containsTag = item.categories.map(cat => cat.toLowerCase()).find(str => str.includes(searchTerm))
        if (item.name.toLowerCase().includes(searchTerm) || containsTag) {
          newList.push(item)
        }
      })
      this.setState({ filteredStartups: newList, filter: searchTerm })

    } else {
      this.setState({ filter: '', filteredStartups: this.state.startups })
    }
    
  }


  render() {
    let loginForm;
    if (this.state.isLoggedIn === false) {
      loginForm = <Login onChange={this.handleFormChange} onSubmit={this.handleFormSubmit} />
    } else if (this.state.isLoggedIn === true) {
      loginForm = <p>Welcome, {this.state.username}! &nbsp;<button id="logout-button" onClick={this.logout}>logout</button></p>

    }

   
    return (
      <div className="App">
        <header  id='App-title' className="App-header">
          The Startup Report
          <Totals totalNumberStartups={this.state.startups.length} totalFunding={this.state.totalFunding} />
          <div id="login-bar"> {loginForm} </div>
        </header>
        <div id="grid-container">
          <div id="startup-list">

            <h1 className='startup-list-header'>{this.state.filter ? this.state.filteredStartups.length + ' startups in: ' + this.state.filter : ''}</h1>

            {this.state.filteredStartups.map(startup => {
              let result = <Startup isLoggedIn={this.state.isLoggedIn} key={startup._id} startup={startup} startups={this.state.startups} updateState={this.updateState} handleClick={this.tempRemoveStartup} filterByTag={this.filterByTag} />
              return result;
            })}
          </div>

          <div id="startup-map">
            <BigMap startups={this.state.filteredStartups} current={this.state.current} updateState={this.updateState} />
          </div>

          <div id="startup-info">
            <Profile startup={this.state.current} />
          </div>
          <div id="search-bar">
            <input type='text' name='search' value={this.props.filter} id="search-form" className="search" placeholder='Search...' onChange={this.handleSearch}></input>
            <button id="list-button" onClick={this.showAll}>show all startups</button>
          </div>
        </div>
      </div>

    );
  }
}

export default App;
