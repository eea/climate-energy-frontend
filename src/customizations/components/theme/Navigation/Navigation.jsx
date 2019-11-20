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

import bgimage from './home.jpg';

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

class Navigation extends Component {
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
    this.isMobile = this.isMobile.bind(this);
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
      isMobile: false,
    };
  }

  componentWillMount() {
    this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
  }

  componentDidMount() {
    document.addEventListener('resize', this.isMobile);
    this.isMobile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.getNavigation(getBaseUrl(nextProps.pathname), 3);
    }
  }

  isMobile() {
    if (__CLIENT__ && window.matchMedia('(max-width: 900px)').matches) {
      this.setState({ isMobile: !this.state.isMobile });
    } else {
      this.setState({ isMobile: this.state.isMobile });
    }
  }

  setSubmenu(title, items) {
    const body = document.querySelector('body');
    if (this.state.subMenu.type === title) {
      body.classList.remove('menu-open-homepage');
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
      body.classList.add('menu-open-homepage');
      this.setState({
        subMenu: {
          type: title,
          items: items,
        },
        subTopics: {
          type: null,
          items: [],
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
        <div id="menu-underlay" />
        <div
          id="menu-background"
          className="background-img"
          style={{ backgroundImage: `url(${bgimage})` }}
        />
        <div id="menu-background-overlay" />
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

          <div
            className={cx('menu-items', {
              'menu-open': !this.state.isMobileMenuOpen,
            })}
          >
            {this.props.items.map(item => (
              <div key={item.url} className="menu-item">
                {item.items && item.items.length ? (
                  <div>
                    <h2
                      onClick={() => this.setSubmenu(item.title, item.items)}
                      className="menu-title"
                    >
                      {/* <Link to={item.url} key={item.url}> */}
                      {item.title}
                      {/* </Link> */}
                    </h2>
                    <div className="menuExpanded" id="menuExpanded">
                      {item.items.find(
                        i =>
                          __CLIENT__ &&
                          window &&
                          window.location.href.includes(i.url) &&
                          window.location.href.includes('topics'),
                      ) ? (
                        <h5>
                          <Link
                            to={
                              item.items.find(
                                i =>
                                  window &&
                                  window.location.href.includes(i.url),
                              ).url
                            }
                            key={
                              item.items.find(
                                i =>
                                  window &&
                                  window.location.href.includes(i.url),
                              ).url
                            }
                          >
                            {
                              item.items.find(
                                i =>
                                  window &&
                                  window.location.href.includes(i.url),
                              ).title
                            }
                          </Link>
                        </h5>
                      ) : (
                        ''
                      )}
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
          {this.state.subMenu.items && this.state.subMenu.items.length ? (
            <div className="sub-menu columns-3">
              {this.state.subMenu.items.map(item => (
                <div key={item.url} className="sub-menu-item">
                  <h2
                    onClick={() => this.setSubtopics(item.title, item.items)}
                    className="submenu-title"
                    onKeyPress={() => {}}
                  >
                    {item.items && item.items.length ? (
                      item.title
                    ) : (
                      <Link
                        to={() => {
                          console.log(item);
                          return item.url === '' ? '/' : item.url;
                        }}
                        key={item.url}
                      >
                        {item.title}
                      </Link>
                    )}
                  </h2>
                </div>
              ))}
            </div>
          ) : (
            ''
          )}
          {this.state.subTopics.items && this.state.subTopics.items.length ? (
            <div className="sub-topics columns-3">
              <h2 className="bold mb-2">
                <i>{this.state.subTopics.type}</i>
              </h2>
              <p className="mb-5">Subtopics</p>
              {this.state.subTopics.items.map(item => (
                <div key={item.url} className="sub-topic-item">
                  <h3 className="sub-topic-title">
                    <Link
                      to={() => {
                        const url = item.items ? item.items[0].url : item.url;
                        return item.url === '' ? '/' : url;
                      }}
                      key={item.url}
                      className={
                        this.isActive(item.url) ? 'item active' : 'item'
                      }
                    >
                      {item.title}
                    </Link>
                  </h3>
                </div>
              ))}
            </div>
          ) : (
            ''
          )}
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
)(Navigation);
