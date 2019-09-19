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

const data = 'http://public.tableau.com/views/RegionalSampleWorkbook/Storms';

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
    let show = this.props.data.chartData ? true : false;

    this.state = {
      show,
      chartData: chartData,
      tableauUrl: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getChartData = this.getChartData.bind(this);
  }

  handleChange(e) {
    let data = e.target.value;
    try {
      data = e.target.value;
      this.setState(
        {
          chartData: data,
          show: __SERVER__ ? false : true,
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
    if (typeof chartData == 'string') {
      try {
        chartData = chartData;
      } catch (error) {
        console.log(error);
        chartData = [];
      }
    }
    console.log(chartData);
    return chartData;
  }

  render() {
    if (__SERVER__) return '';
    const TableauReport = require('tableau-react');
    console.log(this.state);
    return (
      <div className="tile chartWrapperEdit">
        <div className="tile-inner-wrapper">
          {this.state.show && this.state.chartData && this.state.tableauUrl ? (
            <div className="image-add">
              <ResponsiveContainer>
                <TableauReport url={this.state.tableauUrl} />
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
          <div>
            <label>Enter JSON data</label>
            <input
              type="text"
              defaultValue={this.getChartData()}
              placeholder="Enter data in JSON format"
              onChange={this.handleChange}
            />
            <Button
              onClick={() =>
                this.setState({ tableauUrl: this.getChartData(), show: true })
              }
            >
              Show tableau
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default StackedBarChart;
