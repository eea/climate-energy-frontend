/**
 * Search component.
 * @module components/theme/Search/Search
 */

import moment from 'moment';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Helmet } from '@plone/volto/helpers';;
import { Link } from 'react-router-dom';
import { asyncConnect } from 'redux-connect';
import { Portal } from 'react-portal';
import { Container, Breadcrumb, Item, Input } from 'semantic-ui-react';
import qs from 'query-string';
import { settings } from '~/config';

import { searchContent } from '@plone/volto/actions';
import { Icon } from '@plone/volto/components'
import zoomIcon from '@plone/volto/icons/zoom.svg'


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

  getPath(url) {
    return url
      .replace(settings.apiPath, '')
      .replace(settings.internalApiPath, '');
  }

  render() {
    const searchItems = this.props.items?.sort((a, b) => new Date(a.ModificationDate) < new Date(b.ModificationDate))
    return (
      <Container
        id="page-search"
        className="catalogue-body full-width-catalogue"
      >
        <Helmet title="Search" />
          <article id="content">
            <div className="catalogue-header">
              <div className="searchWrapper">
                <Input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="eg: Renewable energy"
                  onKeyPress={(event) => { if (event.key === 'Enter') this.doSearch(this.state.value) }}
                />
                <Icon
                  className="searchIcon"
                  onClick={() => this.doSearch(this.state.value)}
                  name={zoomIcon} size="40px" />
              </div>
            </div>
            <div id="content-core">
              <div className="search-listing item-listing">
                <Item.Group>
                  {searchItems.map(item => (
                    <Item
                      className="search-item"
                      key={item['@id']}
                    >
                      <Item.Content>
                        <Item.Header>
                          <Link to={this.getPath(item['@id'])}>
                            <h3 className="item-title">{item.Title || item.title}</h3>
                          </Link>
                        </Item.Header>

                        {item['@components'] && item['@components'].breadcrumbs && (
                          <div className="item-breadcrumb">
                            <Breadcrumb>
                              {item['@components'].breadcrumbs.items.map(
                                (item, index, items) => [
                                  index < items.length - 1 ? (
                                    <Breadcrumb.Section key={item['@id']}>
                                      <Link to={this.getPath(item['@id'])}>
                                        {item.title}
                                      </Link>
                                      <Breadcrumb.Divider
                                        key={`divider-${item.url}`}
                                      />
                                    </Breadcrumb.Section>
                                  ) : (
                                      <Breadcrumb.Section key={item['@id']}>
                                        <Link to={this.getPath(item['@id'])}>{item.title}</Link>
                                      </Breadcrumb.Section>
                                    ),
                                ],
                              )}
                            </Breadcrumb>
                          </div>
                        )}

                        <Item.Description>
                          {item.description && <div className="descriptionBody">{item.description}</div>}
                          <div
                          className="searchMetadata">
                            {item.topics &&
                              <div>
                                <span className="searchLabel black">Topic:</span>{' '}
                                {item.topics?.join(', ')}
                              </div>}
                            <div>
                              <span className="searchLabel black">Content type:</span>{' '}
                              {item['@type']}
                            </div>
                            <div>
                              <span className="searchLabel black">Modified:</span>{' '}
                              {moment(item.ModificationDate).calendar()}
                            </div>
                          </div>
                        </Item.Description>


                      </Item.Content>
                    </Item>
                  ))}
                </Item.Group>
              </div>
            </div>
          </article>
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
