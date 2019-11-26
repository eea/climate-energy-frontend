import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';
import {} from 'semantic-ui-react';

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
    // this.isMobile = this.isMobile.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.setSubmenu = this.setSubmenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
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
      //, isMobile: false
    };
  }

  componentWillMount() {
    this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
  }

  // componentDidMount(){
  //     document.addEventListener('resize', this.isMobile);
  //     this.isMobile();
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.setSubmenu(this.state.subMenu.type, []);
      this.props.getNavigation(getBaseUrl(nextProps.pathname));
    }
  }

  // isMobile() {
  //   if(window.matchMedia("(max-width: 900px)").matches) {
  //     this.setState({isMobile: !this.state.isMobile})
  //   }
  //   else{
  //     this.setState({isMobile: this.state.isMobile})
  //   }
  // }

  setSubmenu(title, items, ev) {
    const body = document.querySelector('body');

    if (this.state.subMenu.type === title) {
      body.classList.remove('menu-open-contentpage');
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
      body.classList.add('menu-open-contentpage');

      this.setState({
        subMenu: {
          type: title,
          items: items,
        },
      });
    }
    ev && ev.preventDefault();
  }

  setSubtopics(title, items, ev) {
    this.setState({
      subTopics: {
        type: title,
        items: items,
      },
    });
    ev.preventDefault();
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
    if (!__CLIENT__) return '';
    return (
      <div id="app-menu-content">
        <div
          onClick={() => this.setSubmenu(this.state.subMenu.type, [])}
          className="menu-underlay"
        />
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
            className={cx('menu-items', 'example', {
              'menu-open': !this.state.isMobileMenuOpen,
            })}
          >
            {this.props.items.map((item, index) => (
              <div key={item.url} className="menu-item">
                {item.items && item.items.length ? (
                  <div>
                    <h2 className="menu-title">
                      <a
                        href={item.url}
                        role="button"
                        tabindex={index}
                        onClick={ev =>
                          this.setSubmenu(item.title, item.items, ev)
                        }
                        onKeyPress={() => {}}
                      >
                        {/* <Link to={item.url} key={item.url}> */}
                        {item.title}
                        {/* </Link> */}
                      </a>
                    </h2>
                    <div className="menuExpanded" id="menuExpanded">
                      {item.items.find(
                        i =>
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
                    role="button"
                    onClick={ev =>
                      this.setSubtopics(item.title, item.items, ev)
                    }
                    onKeyPress={() => {}}
                    className="submenu-title"
                  >
                    {item.items && item.items.length ? (
                      item.title
                    ) : (
                      <Link
                        to={item.url === '' ? '/' : item.url}
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
                      to={item.url === '' ? '/' : item.url}
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
)(PageNavigation);
