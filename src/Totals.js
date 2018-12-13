import React, { Component } from 'react';
import './Totals.css';
import ReactTooltip from 'react-tooltip'


class Totals extends Component {

  render() {
    return (
      <div className="totals" data-tip={'*funding reported from ' + this.props.fundingArrayLength + ' startups'}>
      <b>{this.props.totalNumberStartups}</b>&nbsp;startups&nbsp;|&nbsp;$<b>{this.props.totalFunding.toLocaleString()}</b>&nbsp;raised*&nbsp;
        <ReactTooltip place="bottom"/>
      </div>
    )
  }
}

export default Totals;
