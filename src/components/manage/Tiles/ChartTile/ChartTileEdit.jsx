import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Button, Input, Message, TextArea } from 'semantic-ui-react';

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

const data = [
  { name: '00', Decidous: 4000, Conifers: 2400 },
  { name: '04', Decidous: 3000, Conifers: 1398 },
  { name: '08', Decidous: 2000, Conifers: 9800 },
  { name: '12', Decidous: 2780, Conifers: 3908 },
  { name: '16', Decidous: 1890, Conifers: 4800 },
];

// const messages = defineMessages({
//     ChartTile: {
//       id: 'Enter chart data',
//       defaultMessage: 'Enter chart data',
//     },
//   });

class StackedBarChart extends Component {
  // static propTypes = {
  //     selected: PropTypes.bool.isRequired,
  //     tile: PropTypes.string.isRequired,
  //     index: PropTypes.number.isRequired,
  //     data: PropTypes.objectOf(PropTypes.any).isRequired,
  //     pathname: PropTypes.string.isRequired,
  //     onChangeTile: PropTypes.func.isRequired,
  //     onSelectTile: PropTypes.func.isRequired,
  //     onDeleteTile: PropTypes.func.isRequired,
  //     onFocusPreviousTile: PropTypes.func.isRequired,
  //     onFocusNextTile: PropTypes.func.isRequired,
  //     handleKeyDown: PropTypes.func.isRequired,
  //     intl: intlShape.isRequired,
  // };

  constructor(props) {
    super(props);

    const chartData = this.props.data.chartData || data;
    this.state = {
      renderChart: true,
      chartData: chartData,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getChartData = this.getChartData.bind(this);
  }

  handleChange(e) {
    let data = e.target.value;
    try {
      data = JSON.parse(e.target.value);
      this.setState(
        {
          chartData: data,
          renderChart: true,
        },
        this.onSubmit,
      );
    } catch {
      console.warning('Invalid JSON data: ', data);
    }
  }

  onSubmit() {
    this.props.onChangeTile(this.props.tile, {
      ...this.props.data,
      chartData: this.state.chartData,
    });
  }

  getChartData() {
    let chartData = this.state.chartData;
    try {
      chartData = JSON.parse(chartData);
    } catch (error) {
      console.log(error);
    }
    console.log(chartData);
    return chartData;
  }

  render() {
    console.log(this.state);
    return (
      <div className="tile hero selected chartWrapperEdit">
        <div className="tile-inner-wrapper">
          {this.state.renderChart && this.state.chartData ? (
            <div className="image-add">
              <ResponsiveContainer>
                <BarChart
                  data={this.state.chartData}
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
          ) : (
            <div className="image-add">
              <div class="ui segment">
                <div class="ui placeholder">
                  <div class="image header">
                    <div class="line" />
                    <div class="line" />
                  </div>
                  <div class="paragraph">
                    <div class="medium line" />
                    <div class="short line" />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="hero-body">
            <textarea
              defaultValue={JSON.stringify(data)}
              placeholder="Enter data in JSON format"
              onChange={this.handleChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default StackedBarChart;
