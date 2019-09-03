import React, { Component } from 'react';
import PropTypes from 'prop-types';


const data = [
    {name: '00', Decidous: 4000, Conifers: 2400,},
    {name: '04', Decidous: 3000, Conifers: 1398,},
    {name: '08', Decidous: 2000, Conifers: 9800,},
    {name: '12', Decidous: 2780, Conifers: 3908,},
    {name: '16', Decidous: 1890, Conifers: 4800,},
];
  
  class StackedBarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderChart: false,
        
        }
    }



    render() {
      return <ResponsiveContainer>
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
         
        }
  }
  

  export default StackedBarChart