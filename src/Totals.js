import React, { Component } from 'react';
import './Totals.css';

class Totals extends Component {

  render() {
    return (
      <div className="totals">
        <b>{this.props.totalNumberStartups}</b>&nbsp;startups&nbsp;|&nbsp;$<b>{this.props.totalFunding.toLocaleString()}</b>&nbsp;raised&nbsp;
      </div>
    )
  }
}

export default Totals;
