import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import React, { Component } from 'react';
import { getIndexValues } from '~/actions';
import { Menu, Label } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';

class Filter extends Component {
  componentDidMount() {
    if (this.props.facetFilter) {
      this.props.getIndexValues(this.props.facetFilter.token);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.facetFilter.token !== prevProps.facetFilter.token) {
      this.props.getIndexValues(this.props.facetFilter.token);
    }
  }

  computeStats() {
    const filters = this.props.filters;
    const results = this.props.results;
    const facetFilter = this.props.facetFilter;

    if (!results) return [];

    const res = {};
    filters.forEach(f => {
      res[f] = 0;
    });
    results.forEach(item => {
      filters.forEach(f => {
        if (
          item[facetFilter.token] &&
          item[facetFilter.token].indexOf(f) > -1
        ) {
          res[f] += 1;
        }
      });
    });
    return res;
  }

  render() {
    const stats = this.computeStats();
    return __CLIENT__ &&
      this.props.facetFilter &&
      document.querySelector('.content-page .inPageNavigation') ? (
      <Portal
        node={
          __CLIENT__ &&
          document.querySelector('.content-page .inPageNavigation')
        }
      >
        <div className="headings_navigation">
          <h5>
            <b>Filter by {this.props.facetFilter.title}</b>
          </h5>
          <Menu vertical>
            {this.props.filters.map(item => (
              <Menu.Item
                key={item}
                name={item}
                onClick={this.props.handleSelectFilter}
                active={this.props.selectedValue === item}
              >
                <Label color="teal">{stats[item]}</Label>
                {item}
              </Menu.Item>
            ))}
          </Menu>
          {this.props.selectedValue ? (
            <Button
              onClick={() => this.props.handleSelectFilter(null, { name: '' })}
            >
              Clear
            </Button>
          ) : (
            <></>
          )}
        </div>
      </Portal>
    ) : (
      ''
    );
  }
}

export default connect(
  (state, props) => {
    return {
      filters: (state.index_values && state.index_values.items) || [],
    };
  },
  {
    getIndexValues,
  },
)(Filter);
