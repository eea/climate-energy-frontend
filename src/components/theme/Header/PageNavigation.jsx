import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { Menu } from 'semantic-ui-react';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';

import { getNavigation } from '@plone/volto/actions';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

class PageNavigation extends Component {
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      }),
    ).isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.setSubmenu = this.setSubmenu.bind(this);
    this.setSubtopics = this.setSubtopics.bind(this);
    this.state = {
      isMobileMenuOpen: false,
      subMenu: {
        type: null,
        items: [],
      },
      subTopics: {
        type: null,
        items: [],
      },
    };
  }

  componentWillMount() {
    this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.getNavigation(getBaseUrl(nextProps.pathname));
    }
  }

  setSubmenu(title, items) {
    if (this.state.subMenu.type === title) {
      this.setState({
        subMenu: {
          type: null,
          items: [],
        },
        subTopics: {
          type: null,
          items: [],
        },
      });
    } else {
      this.setState({
        subMenu: {
          type: title,
          items: items,
        },
      });
    }
  }

  setSubtopics(title, items) {
    this.setState({
      subTopics: {
        type: title,
        items: items,
      },
    });
  }

  isActive(url) {
    return (
      (url === '' && this.props.pathname === '/') ||
      (url !== '' && isMatch(this.props.pathname.split('/'), url.split('/')))
    );
  }

  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen });
  }

  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false });
  }

  render() {
    return (
      <div id="app-menu-content">
        <div className="menu">
          <div className="hamburger-wrapper mobile only">
            <button
              className={cx('hamburger hamburger--collapse', {
                'is-active': this.state.isMobileMenuOpen,
              })}
              aria-label={
                this.state.isMobileMenuOpen
                  ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                      type: this.props.type,
                    })
                  : this.props.intl.formatMessage(messages.openMobileMenu, {
                      type: this.props.type,
                    })
              }
              title={
                this.state.isMobileMenuOpen
                  ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                      type: this.props.type,
                    })
                  : this.props.intl.formatMessage(messages.openMobileMenu, {
                      type: this.props.type,
                    })
              }
              type="button"
              onClick={this.toggleMobileMenu}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </div>

          <div className="menu-items">
            {this.props.items.map(item => (
              <div key={item.url} className="menu-item">
                {item.items && item.items.length ? (
                  <div>
                    <h2
                      onClick={() => this.setSubmenu(item.title, item.items)}
                      className="menu-title"
                      onKeyPress={() => {}}
                    >
                      {item.title}
                    </h2>
                    <div className="menuExpanded">
                      <ul>
                        <h5>
                          {item.items.find(i =>
                            window && window.location.href.includes(i.url),
                          ) ? (
                            <Link
                              to={
                                item.items.find(i =>
                                  window && window.location.href.includes(i.url),
                                ).url
                              }
                              key={
                                item.items.find(i =>
                                  window && window.location.href.includes(i.url),
                                ).url
                              }
                            >
                              {
                                item.items.find(i =>
                                  window && window.location.href.includes(i.url),
                                ).title
                              }
                            </Link>
                          ) : (
                            ''
                          )}
                        </h5>
                        {item.items.map(sub =>
                          sub.items && sub.items.length
                            ? sub.items.map(subSub => (
                                <li key={subSub.url}>
                                  <Link
                                    to={subSub.url === '' ? '/' : subSub.url}
                                    key={subSub.url}
                                  >
                                    {subSub.title}
                                  </Link>
                                </li>
                              ))
                            : '',
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.url === '' ? '/' : item.url}
                    key={item.url}
                    className={this.isActive(item.url) ? 'item active' : 'item'}
                  >
                    <h2 className="menu-title">{item.title}</h2>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    state => ({
      items: state.navigation.items,
    }),
    { getNavigation },
  ),
)(PageNavigation);
