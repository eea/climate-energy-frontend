import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TilesListing from './TilesListing';
import { getBaseUrl } from '@plone/volto/helpers';
import { Pagination } from '@plone/volto/components';
//import { getContentWithData } from 'volto-addons/actions';
import { searchContent } from '@plone/volto/actions';
import Filter from './Filter';

import './style.css';

function filterResults(results = [], filterValue, facetFilter) {
  if (!(filterValue && facetFilter)) return results;

  return results.filter(obj =>
    (obj[facetFilter.token] || []).indexOf(filterValue) > -1 ? true : false,
  );
}

class BlockView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      all_items: [],
      filteredResults: [],
      activeFilter: null,
      currentPage: 0,
      pageSize: 15,
      pageSizes: [15, 30, 50],
      totalPages: 0,
    };

    this.getRequestKey = this.getRequestKey.bind(this);
    this.handleSelectFilter = this.handleSelectFilter.bind(this);
    this.loadContent = this.loadContent.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
  }

  handleSelectFilter(ev, { name }) {
    const filteredResults = filterResults(
      this.state.all_items,
      name,
      this.props.data.facetFilter,
    );

    this.setState({
      activeFilter: name,
      filteredResults,
      currentPage: 0,
      results: filteredResults.slice(0, this.state.pageSize),
      totalPages: Math.ceil(filteredResults.length / this.state.pageSize),
    });
  }

  onChangePage(ev, { value }) {
    const b_size = this.state.pageSize;
    const b_start = value * b_size;
    const end = b_start + b_size;

    this.setState({
      currentPage: value,
      results: this.state.filteredResults.slice(b_start, end),
    });
  }

  onChangePageSize(ev, { value }) {
    const b_size = value;
    const b_start = 0;
    const end = b_start + b_size;
    this.setState({
      pageSize: value,
      currentPage: 0,
      results: this.state.filteredResults.slice(b_start, end),
      totalPages: Math.ceil(this.state.filteredResults.length / value),
    });
  }

  getRequestKey() {
    return `col-content:${this.props.block}`;
  }

  loadContent() {
    const path = this.props.data.collection_url;
    if (!path) return;

    // NOTE: while this works, we needed a ton of overrides: override for
    // Collection behavior in eea.restapi and a new action, the
    // getContentWithData. I think this can be achieved by using the @search
    // endpoint, reading the collection query property and changing that, to
    // pass a custom query to the endpoint
    const url = `${getBaseUrl(path)}`;
    const options = {
      metadata_fields: '_all',
      is_search: 1,
      // b_start: this.state.currentPage * this.state.pageSize,
      // b_size: this.state.pageSize,
      // custom_query: this.state.activeFilter
      //   ? [
      //       {
      //         i: this.props.facetFilter,
      //         o: 'plone.app.querystring.operation.any',
      //         v: this.state.activeFilter,
      //       },
      //     ]
      //   : [],
    };
    this.props.getContentWithData(url, null, this.getRequestKey(), options);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data.collection_url !== this.props.data.collection_url) {
      return this.loadContent();
    }
    const key = this.getRequestKey();
    if (!prevProps.contentSubrequests[key]) {
      return;
    }

    const prev = prevProps.contentSubrequests[key];
    const now = this.props.contentSubrequests[key];

    if (prev.loading && now.loaded) {
      // now.data.items_total
      const filteredResults = filterResults(
        now.data.items,
        this.state.activeFilter,
        this.props.data.facetFilter,
      );
      const b_size = this.state.pageSize;
      const b_start = this.state.currentPage * b_size;
      const end = b_start + b_size;
      this.setState({
        all_items: now.data.items,
        filteredResults,
        results: filteredResults.slice(b_start, end),
        totalPages: Math.ceil(filteredResults.length / this.state.pageSize),
      });
      return;
    }
  }

  componentDidMount() {
    this.loadContent();
  }

  render() {
    return this.state.results ? (
      <div>
        <TilesListing items={this.state.results} />
        {this.state.totalPages > 1 && (
          <div className="tile-listing-pagination">
            <Pagination
              current={this.state.currentPage}
              total={this.state.totalPages}
              pageSize={this.state.pageSize}
              pageSizes={this.state.pageSizes}
              onChangePage={this.onChangePage}
              onChangePageSize={this.onChangePageSize}
            />
          </div>
        )}
        {this.props.data.facetFilter ? (
          <Filter
            handleSelectFilter={this.handleSelectFilter}
            facetFilter={this.props.data.facetFilter}
            selectedValue={this.state.activeFilter}
            results={this.state.all_items}
          />
        ) : (
          ''
        )}
      </div>
    ) : (
      ''
    );
  }
}

BlockView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default connect(
  (state, props) => ({
    contentSubrequests: state.content.subrequests,
  }),
  {
    searchContent,
  },
)(BlockView);
