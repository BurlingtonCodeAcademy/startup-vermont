import React, { Component } from 'react';
import './Totals.css';
import ReactTooltip from 'react-tooltip'


class Totals extends Component {

  render() {
    return (
      <div className="totals" data-tip={'*funding reported from ' + this.props.fundingArrayLength + ' startups'}>
        <b>{this.props.totalNumberStartups}</b><font size="11px">&nbsp;startups&nbsp;</font>
        <ReactTooltip place="bottom"/>
        | $<b>{this.props.totalFunding.toLocaleString()}</b><font size="11px">&nbsp;raised*&nbsp; </font>
      </div>
    )
  }
}

export default Totals;
