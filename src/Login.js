import React, { Component } from 'react';
import './Login.css';


class Login extends Component {

  render() {
    return(
    <form onSubmit={this.props.onSubmit}>
    <label>
      <input className='login-box' type='text' name="username" placeholder='username' value={this.props.username} onChange={this.props.onChange}/>
    </label>
    <label>
      <input className='login-box' type='password' name="password" placeholder='password' value={this.props.password} onChange={this.props.onChange}/>
    </label>
    <input type="submit" value="Login" className='login-button' onClick={this.props.onSubmit}/>
    </form>
    )
  }
}

export default Login;