/**
 * View image tile.
 * @module components/manage/Tiles/Hero/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { flattenToAppURL } from '@plone/volto/helpers';
// import PropTypes from 'prop-types';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/**
 * View image tile class.
 * @class View
 * @extends Component
 */
class StackedBarChartView extends Component {
  constructor(props) {
    super(props);

    const chartData = this.props.data.chartData || [];
    this.state = {
      renderChart: true,
      chartData: chartData,
    };

    this.getChartData = this.getChartData.bind(this);
  }

  getChartData() {
    let chartData = this.state.chartData;
    if (typeof chartData == 'string') {
      try {
        chartData = JSON.parse(chartData);
      } catch (error) {
        console.log(error);
        chartData = [];
      }
    }
    console.log(chartData);
    return chartData;
  }

  render() {
    return (
      <div className="chartWrapperView">
        <div className="tile-inner-wrapper">
          {this.state.renderChart ? (
            <ResponsiveContainer>
              <BarChart
                data={this.getChartData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Decidous" stackId="a" fill="#225511" />
                <Bar dataKey="Conifers" stackId="a" fill="#769e2e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div>Invalid or missing data.</div>
          )}
        </div>
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
StackedBarChartView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StackedBarChartView;
