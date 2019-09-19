/**
 * View image tile.
 * @module components/manage/Tiles/Hero/View
 */

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { flattenToAppURL } from '@plone/volto/helpers';
// import PropTypes from 'prop-types';

/**
 * View image tile class.
 * @class View
 * @extends Component
 */
class TableauTestView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      renderChart: __SERVER__ ? false : true,
      visURL: '',
    };
  }

  render() {
    if (__SERVER__) return '';
    const TableauReport = require('tableau-react');
    return (
      <div className="chartWrapperView">
        {this.state.renderChart ? (
          <TableauReport url={this.getChartData()} />
        ) : (
          <div>Invalid or missing data.</div>
        )}
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
export default TableauTestView;
