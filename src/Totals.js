import React, { Component } from 'react';
import './Totals.css';

class Totals extends Component {

  render() {
    return (
      <div className="totals">
        <b>{this.props.totalNumberStartups}</b><font size="11px">&nbsp;startups&nbsp;</font>
        | $<b>{this.props.totalFunding}</b><font size="11px">&nbsp;raised&nbsp; </font>
      </div>
    )
  }
}

export default Totals;
