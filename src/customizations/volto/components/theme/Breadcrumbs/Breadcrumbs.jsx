/**
 * Breadcrumbs components.
 * @module components/theme/Breadcrumbs/Breadcrumbs
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { Breadcrumb, Container, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';

import { Icon } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';
import { settings } from '~/config';

import homeSVG from '@plone/volto/icons/home.svg';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
});

const RouterLink = ({ item }) => {
  const url = (item.url || item['@id'])
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
  return (
    <Link title={item.title} to={url} className="section">
      {item.title}
    </Link>
  );
};

/**
 * Breadcrumbs container class.
 * @class Breadcrumbs
 * @extends Component
 */
class Breadcrumbs extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Breadcrumb>
        <Link
          to="/"
          key="home-section-/"
          className="section"
          title={this.props.intl.formatMessage(messages.home)}
        >
          <Icon name={homeSVG} size="18px" />
        </Link>
        {this.props.items &&
          this.props.items.length &&
          this.props.items.map((item, index, items) => [
            <Breadcrumb.Divider key={`divider-${index}-${item.url}`} />,
            index < items.length - 1 ? (
              <RouterLink item={item} key={index} />
            ) : (
              <Breadcrumb.Section key={`section-${item.url}`} active>
                {item.title}
              </Breadcrumb.Section>
            ),
          ])}
      </Breadcrumb>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => {
      const content =
        state.prefetch?.[state.router.location.pathname] || state.content.data;
      return {
        items: content?.['@components']?.breadcrumbs?.items || [],
      };
    },
    {},
  ),
)(Breadcrumbs);
