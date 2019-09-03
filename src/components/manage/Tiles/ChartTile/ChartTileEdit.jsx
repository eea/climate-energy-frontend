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
            chartData: [
                {
                    name: '00',
                    Decidous: 4000,
                    Conifers: 2400
                }
            ]
        }
    }

    handleSubmit(){
        this.setState({renderChart: true})
    }
    


    render() {
      return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <div className="inputs">
                    {this.state.chartData.map((input, index) => {
                        return (
                            <div className="input-group">
                                <input type="text" placeholder="name" value={input.name}/>
                                <input type="text" placeholder="Decidous" value={input.Decidous}/>
                                <input type="text" placeholder="Conifers" value={input.Conifers}/>
                            </div>
                        )
                    })}
                    <button class="btn" type="submit"></button>
                </div>
            </form>
              {this.state.renderChart ? 
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
              : ''}
          </div>

            );
        }
  }
  

  export default StackedBarChart