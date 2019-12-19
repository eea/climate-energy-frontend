/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';

import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { getBaseUrl } from '@plone/volto/helpers';
import { getNavigation } from '@plone/volto/actions';
import rightKey from '@plone/volto/icons/right-key.svg';
import { Icon } from '@plone/volto/components';
import backIcon from '@plone/volto/icons/back.svg';
import { getLocalnavigation } from '~/actions';
import { flattenToAppURL } from '@plone/volto/helpers';
import { settings, blocks } from '~/config';
import rightCircle from '@plone/volto/icons/circle-right.svg'

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
    getLocalnavigation: PropTypes.func.isRequired,
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
  // componentDidUpdate(prevProps) {
  //   if (prevProps.pathname !== this.props.pathname) {
  //     const url = this.props.pathname;
  //     this.props.getLocalnavigation(url);
  //   }
  // }
  componentWillMount() {
    this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
    this.props.getLocalnavigation(getBaseUrl(this.props.pathname));
  }

  // componentDidMount() {
  //   const url = this.props.content['@id']
  //     .replace(settings.apiPath, '')
  //     .replace(settings.internalApiPath, '');

  //   this.props.getLocalnavigation(url);
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.closeMobileMenu()
      this.setSubmenu(this.state.subMenu.type, []);
      this.props.getNavigation(getBaseUrl(nextProps.pathname));
      this.props.getLocalnavigation(getBaseUrl(nextProps.pathname));
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
    ev && ev.preventDefault();
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
    const localnavigation =
      (this.props.localnavigation.items &&
        this.props.localnavigation.items.length &&
        this.props.localnavigation.items.filter(
          item => item.title !== 'Home',
        )) ||
      [];
    console.log('navigation', this.props.items);
    console.log('localnav', localnavigation, this.props.localnavigation);
    return (
      <React.Fragment>
        <div className="hamburger-wrapper tablet mobile only">
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
          className={cx('main-menu', {
            'menu-open': this.state.isMobileMenuOpen,
          })}
        >
          <div
            onClick={() => this.setSubmenu(this.state.subMenu.type, [])}
            className="menu-underlay"
          />

          <div className="first-level">
            {this.props.items.map((item, index) => (
              <div
                key={item.url}
                className={
                  this.isActive(item.url) ? 'menu-item active' : 'menu-item'
                }
              >
                {item.items && item.items.length ? (
                  <React.Fragment>
                    <a
                      role="button"
                      onClick={ev =>
                        this.setSubmenu(item.title, item.items, ev)
                      }
                      onKeyPress={() => {}}
                    >
                      {this.state.subMenu.type === item.title && (
                        <Icon
                          className="menu-indicator"
                          name={rightKey}
                          size="30px"
                        />
                      )}

                      {item.title}
                    </a>
                    {this.isActive(item.url) && (
                      <div className="menuExpanded" id="menuExpanded">
                        {item.items.find(
                          i =>
                            __CLIENT__ &&
                            window &&
                            window.location.href.includes(i.url) &&
                            window.location.href.includes('topics'),
                        ) ? (
                          <Link
                            style={{
                              fontSize: '1.2rem',
                              textTransform: 'initial',
                              borderBottom: '1px solid #eee',
                            }}
                            to={
                              item.items.find(
                                i =>
                                  __CLIENT__ &&
                                  window &&
                                  window.location.href.includes(i.url),
                              ).url
                            }
                            key={
                              item.items.find(
                                i =>
                                  __CLIENT__ &&
                                  window &&
                                  window.location.href.includes(i.url),
                              ).url
                            }
                          >
                            {
                              item.items.find(
                                i =>
                                  __CLIENT__ &&
                                  window &&
                                  window.location.href.includes(i.url),
                              ).title
                            }
                          </Link>
                        ) : (
                          ''
                        )}
                        {localnavigation && localnavigation.length ? (
                          <ul className="localnavigation">
                            {localnavigation.map(item => (
                              <li
                                className={
                                  (flattenToAppURL(
                                    this.props.pathname,
                                  ).includes(flattenToAppURL(item['@id'])) &&
                                    'active') ||
                                  ''
                                }
                                key={`li-${item['@id']}`}
                              >
                                {flattenToAppURL(this.props.pathname).includes(
                                  flattenToAppURL(item['@id']),
                                ) && (
                                  <span className="menuExpandedIndicator">
                                    <Icon
                                      name={rightCircle}
                                      size="20px"
                                    />
                                  </span>
                                )}
                               
                                <Link
                                  key={item['@id']}
                                  to={
                                    item.items && item.items.length
                                      ? flattenToAppURL(item.items[0]['@id'])
                                      : flattenToAppURL(item['@id'])
                                  }
                                >
                                  {item.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                  </React.Fragment>
                ) : (
                  <Link to={item.url === '' ? '/' : item.url} key={item.url}>
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
          {this.state.subMenu.items && this.state.subMenu.items.length ? (
            <div className="second-level">
              <Icon
                name={backIcon}
                onClick={() => this.setSubmenu(this.state.subMenu.type, [])}
                className="mobile-back-button"
              />
              {this.state.subMenu.items.map(item => (
                <div
                  key={item.url}
                  className={
                    this.isActive(item.url) ? 'menu-item active' : 'menu-item'
                  }
                >
                  {item.items && item.items.length ? (
                    <a
                      role="button"
                      onClick={ev =>
                        this.setSubtopics(item.title, item.items, ev)
                      }
                      onKeyPress={() => {}}
                    >
                      {this.state.subTopics.type === item.title && (
                        <Icon
                          className="menu-indicator"
                          name={rightKey}
                          size="30px"
                        />
                      )}
                      {item.title}
                    </a>
                  ) : (
                    <Link to={item.url === '' ? '/' : item.url} key={item.url}>
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div />
          )}
          {this.state.subTopics.items && this.state.subTopics.items.length ? (
            <div className="third-level">
              <Icon
                name={backIcon}
                onClick={() => this.setSubtopics(null, [])}
                className="mobile-back-button"
              />
              <h2 style={{ fontWeight: 600 }}>
                <i>{this.state.subTopics.type}</i>
              </h2>
              <p style={{ fontWeight: 100 }} className="mb-5">
                Subtopics
              </p>
              {this.state.subTopics.items.map(item => (
                <div
                  key={item.url}
                  className={
                    this.isActive(item.url) ? 'menu-item active' : 'menu-item'
                  }
                >
                  <Link
                    to={(item.url = item.items ? item.items[0].url : item.url)}
                    key={item.url}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            ''
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default compose(
  injectIntl,
  asyncConnect([
    {
      key: 'localnavigation',
      promise: ({ location, store: { content, dispatch } }) =>
        dispatch(getLocalnavigation(getBaseUrl(location.pathname))),
    },
  ]),
  connect(
    (state, props) => ({
      localnavigation: state.localnavigation.items,
      items: state.navigation.items,
    }),
    { getNavigation, getLocalnavigation },
  ),
)(PageNavigation);
