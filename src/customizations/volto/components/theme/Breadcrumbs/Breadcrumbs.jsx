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

import homeSVG from '@plone/volto/icons/home.svg';

const messages = defineMessages({
  home: {
    id: 'Home',
    defaultMessage: 'Home',
  },
});

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
          className="section"
          title={this.props.intl.formatMessage(messages.home)}
        >
          <Icon name={homeSVG} size="18px" />
        </Link>
        {this.props.items && this.props.items.length && this.props.items.map((item, index, items) => [
          <Breadcrumb.Divider key={`divider-${item.url}`} />,
          index < items.length - 1 ? (
            <Link
              key={item.url}
              title={item.title}
              to={item.url}
              className="section"
            >
              {item.title}
            </Link>
          ) : (
            <Breadcrumb.Section key={item.url} active>
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
    state => ({
      items:
        state.content.data &&
        state.content.data['@components'].breadcrumbs.items,
    }),
    {},
  ),
)(Breadcrumbs);
