import React, { Component } from 'react';
//import './.css';


class Login extends Component {
constructor(props){
  super(props);
}

  render() {
    return(
    <form onSubmit={this.props.onSubmit}>
    <label>Username:&nbsp;
      <input type='text' name="username" value={this.props.username} onChange={this.props.onChange}/>
    </label>
    <label>&nbsp; Password: &nbsp;
      <input type='text' name="password" value={this.props.password} onChange={this.props.onChange}/>
    </label>
    <input type="submit" value="Submit" onClick={this.props.onSubmit}/>
    </form>
    )
  }
}

export default Login;