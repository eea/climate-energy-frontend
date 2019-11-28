/**
 * Search component.
 * @module components/theme/Search/Search
 */

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { asyncConnect } from 'redux-connect';
import { Portal } from 'react-portal';
import { Container } from 'semantic-ui-react';
import qs from 'query-string';

import { searchContent } from '@plone/volto/actions';

import { Toolbar } from '@plone/volto/components'; // SearchTags,

// import { FormattedMessage } from 'react-intl';
// import { Placeholder } from 'semantic-ui-react';

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
            <div className="catalogue-header">
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
                  className="fa fa-search"
                />
              </div>
            </div>
            <div className="cards" id="content-core">
              {this.props.items.map(item => (
                <div className="card" key={item['@id']}>
                  <div className="card-detail with-content">
                    <Link to={item['@id']}>
                      <h3 className="card-title">{item.title}</h3>
                      {item.description && <span>{item.description}</span>}
                    </Link>
                    {item['@components'] && item['@components'].breadcrumbs && (
                      <div className="card-content">
                        {item['@components'].breadcrumbs.items.map(b => (
                          <div key={b['@id']}>
                            <Link to={b['@id']}>{b.title}</Link>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="card-bottom" style={{ display: 'flex' }}>
                      <p>
                        <span className="muted">Content type:</span>{' '}
                        {item['@type']}
                      </p>
                      &nbsp; &nbsp; &nbsp;
                      <p>
                        <span className="muted">Topic:</span> Energy efficiency
                      </p>
                      &nbsp; &nbsp; &nbsp;
                      <p>
                        <span className="muted">Date:</span>{' '}
                        {moment(item.ModificationDate).calendar()}
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
