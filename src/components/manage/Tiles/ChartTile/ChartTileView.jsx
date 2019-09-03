/**
 * View image tile.
 * @module components/manage/Tiles/Hero/View
 */

import React from 'react';
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
const StackedBarChartView = ({ data }) => (
  <div className="chartWrapperView">
    <div className="tile-inner-wrapper">
      <ResponsiveContainer>
        <BarChart
          data={JSON.parse(data.chartData)}
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
    </div>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
StackedBarChartView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default StackedBarChartView;
