/**
 * Search component.
 * @module components/theme/Search/Search
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { asyncConnect } from 'redux-connect';
import { FormattedMessage } from 'react-intl';
import { Portal } from 'react-portal';
import { Container } from 'semantic-ui-react';
import qs from 'query-string';

import { searchContent } from '@plone/volto/actions';

import { SearchTags, Toolbar } from '@plone/volto/components';
import { Placeholder } from 'semantic-ui-react';

const toSearchOptions = (searchableText, subject, path) => {
  return {
    ...(searchableText && { SearchableText: searchableText }),
    ...(subject && {
      Subject: subject,
    }),
    ...(path && {
      path: path,
    }),
  };
};

/**
 * Search class.
 * @class SearchComponent
 * @extends Component
 */
class Search extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    searchContent: PropTypes.func.isRequired,
    searchableText: PropTypes.string,
    subject: PropTypes.string,
    path: PropTypes.string,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    pathname: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: this.props.searchableText,
    };
  }

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    items: [],
    searchableText: null,
    subject: null,
    path: null,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    this.doSearch(
      this.props.searchableText,
      this.props.subject,
      this.props.path,
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps = nextProps => {
    if (
      nextProps.searchableText !== this.props.searchableText ||
      nextProps.subject !== this.props.subject
    ) {
      this.doSearch(
        nextProps.searchableText,
        nextProps.subject,
        this.props.path,
      );
    }
  };

  /**
   * Search based on the given searchableText, subject and path.
   * @method doSearch
   * @param {string} searchableText The searchable text string
   * @param {string} subject The subject (tag)
   * @param {string} path The path to restrict the search to
   * @returns {undefined}
   */

  doSearch = (searchableText, subject, path) => {
    this.props.searchContent(
      '',
      toSearchOptions(searchableText, subject, path),
    );
  };

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    console.log('props in search', this.props.items);
    return (
      <Container
        id="page-search"
        className="catalogue-body full-width-catalogue"
      >
        <Helmet title="Search" />
        <div className="container">
          <article id="content">
            {/* <header>
              <h1 className="documentFirstHeading">
                {this.props.searchableText ? (
                  <FormattedMessage
                    id="Search results for {term}"
                    defaultMessage="Search results for {term}"
                    values={{
                      term: <q>{this.props.searchableText}</q>,
                    }}
                  />
                ) : (
                  <FormattedMessage
                    id="Search results"
                    defaultMessage="Search results"
                  />
                )}
              </h1>
              <SearchTags />
            </header> */}
            <div class="catalogue-header">
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="eg: Renewable energy"
                />
                <i
                  aria-hidden="true"
                  onClick={() => this.doSearch(this.state.value)}
                  class="fa fa-search"
                />
              </div>
            </div>
            <div class="cards" id="content-core">
              {this.props.items.map(item => (
                <div className="card" key={item['@id']}>
                  <Link
                    to={item['@id']}
                    className="card-content"
                    title={item['@type']}
                  >
                    <div className="card-image">
                      {/* <img src={Placeholder}></img> */}
                      <Placeholder style={{ height: 150, width: 150 }}>
                        <Placeholder.Image />
                      </Placeholder>
                    </div>
                  </Link>

                  <div className="card-detail with-content">
                    <Link to={item['@id']}>
                      <h3 className="card-title">{item.title}</h3>
                      {item.description && <span>{item.description}</span>}
                    </Link>
                    <div className="card-bottom" style={{ display: 'flex' }}>
                      <p>
                        <span className="muted">Content type:</span> Data
                      </p>
                      &nbsp; &nbsp; &nbsp;
                      <p>
                        <span className="muted">Topic:</span> Energy efficiency
                      </p>
                      &nbsp; &nbsp; &nbsp;
                      <p>
                        <span className="muted">Date:</span> October 4, 2019
                      </p>
                    </div>
                  </div>
                  <div className="visualClear" />
                </div>
              ))}
            </div>
          </article>
        </div>
        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar
            pathname={this.props.pathname}
            hideDefaultViewButtons
            inner={<span />}
          />
        </Portal>
        {__CLIENT__ &&
        document.querySelector('.cols.content-cols .inPageNavigation') ? (
          <Portal
            node={
              __CLIENT__ &&
              document.querySelector('.cols.content-cols .inPageNavigation')
            }
          >
            <div className="content-page catalogue-filters">
              <h5 style={{ color: 'rgb(170, 170, 170)' }}>
                <b>FILTERS</b>
              </h5>
              <div className="collapsible-wrapper">
                <div className="collapsible-panel accordion-item">
                  <div className="collapsible-panel__header">
                    <button
                      aria-controls="collapsible-0"
                      className="collapsible-panel__headline"
                      aria-expanded="true"
                    >
                      <svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 1792 1792"
                        className="collapsible-panel__arrow collapsible-panel__arrow--expanded"
                      >
                        <path
                          d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"
                          fill="#333"
                        />
                      </svg>
                      <div>
                        <b>Content Types</b>
                      </div>
                    </button>
                    <div className="collapsible-panel__actions" />
                  </div>
                  <div
                    id="collapsible-0"
                    className="collapsible-panel__container"
                  >
                    <div className="filters-list">
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Data
                      </div>
                      <div className="filter selected">
                        <i className="fa fa-check" />
                        Indicators
                      </div>
                      <div className="filter selected">
                        <i className="fa fa-check" />
                        Briefings
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Reports
                      </div>
                    </div>
                  </div>
                </div>
                <div className="filters-list" />
              </div>
              <div className="collapsible-wrapper">
                <div className="collapsible-panel accordion-item">
                  <div className="collapsible-panel__header">
                    <button
                      aria-expanded="true"
                      aria-controls="collapsible-0"
                      className="collapsible-panel__headline"
                    >
                      <svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 1792 1792"
                        className="collapsible-panel__arrow collapsible-panel__arrow--expanded"
                      >
                        <path
                          d="M1395 736q0 13-10 23l-466 466q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l393 393 393-393q10-10 23-10t23 10l50 50q10 10 10 23z"
                          fill="#333"
                        />
                      </svg>
                      <div>
                        <b> Topics</b>
                      </div>
                    </button>
                    <div className="collapsible-panel__actions" />
                  </div>
                  <div
                    id="collapsible-0"
                    className="collapsible-panel__container"
                  >
                    <div className="filters-list">
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Greenhouse gas emissions and projections
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Renewable energy
                      </div>
                      <div className="filter selected">
                        <i className="fa fa-check" />
                        Energy efficiency
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Transport
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Ozone-depleting substances
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Fluorinated greenhouse gases
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Land and forests
                      </div>
                      <div className="filter">
                        <i className="fa fa-dot-circle" />
                        Adaptation to climate change
                      </div>
                    </div>
                  </div>
                </div>
                <div className="filters-list" />
              </div>
            </div>
          </Portal>
        ) : (
          ''
        )}
      </Container>
    );
  }
}

export const __test__ = connect(
  (state, props) => ({
    items: state.search.items,
    searchableText: qs.parse(props.location.search).SearchableText,
    subject: qs.parse(props.location.search).Subject,
    path: qs.parse(props.location.search).path,
    pathname: props.location.pathname,
  }),
  { searchContent },
)(Search);

export default compose(
  connect(
    (state, props) => ({
      items: state.search.items,
      searchableText: qs.parse(props.location.search).SearchableText,
      subject: qs.parse(props.location.search).Subject,
      path: qs.parse(props.location.search).path,
      pathname: props.location.pathname,
    }),
    { searchContent },
  ),
  asyncConnect([
    {
      key: 'search',
      promise: ({ location, store: { dispatch } }) =>
        dispatch(
          searchContent(
            '',
            toSearchOptions(
              qs.parse(location.search).SearchableText,
              qs.parse(location.search).Subject,
              qs.parse(location.search).path,
            ),
          ),
        ),
    },
  ]),
)(Search);
