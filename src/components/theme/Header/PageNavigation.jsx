/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import rightKey from '@plone/volto/icons/right-key.svg';
import { Icon } from '@plone/volto/components';
import backIcon from '@plone/volto/icons/back.svg';
import { flattenToAppURL } from '@plone/volto/helpers';
import { settings } from '~/config';
import rightCircle from '@plone/volto/icons/circle-right.svg';
import MenuPosition from './MenuPosition';
import { getBasePath } from '~/helpers';
import { BodyClass } from '@plone/volto/helpers';

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

function getPath(url) {
  if (!url) return '';
  return url
    .replace(settings.apiPath, '')
    .replace(settings.internalApiPath, '');
}

class PageNavigation extends Component {
  static propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.setSubmenu = this.setSubmenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.setSubtopics = this.setSubtopics.bind(this);
    this.setTopDistance = this.setTopDistance.bind(this);
    this.setCurrentTop = this.setCurrentTop.bind(this);

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
      topDistance: 0,
      currentTopDistance: 0,
    };
    this.menuWrapperRef = React.createRef();
  }
  // componentWillMount() {
  //   // this.props.getNavigation(getBaseUrl(this.props.pathname), 3);
  //   // this.props.getLocalnavigation(getBaseUrl(this.props.pathname));
  // }
  componentDidMount() {
    this.setState({ topDistance: 300, currentTopDistance: 300 });
  }

  setTopDistance(distance) {
    this.setState({ topDistance: distance });
  }

  setCurrentTop(distance) {
    this.setState({ currentTopDistance: distance });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.closeMobileMenu();
      this.setSubmenu(this.state.subMenu.type, []);
      // this.props.getNavigation(getBaseUrl(nextProps.pathname));
      // this.props.getLocalnavigation(getBaseUrl(nextProps.pathname));
    }
  }

  setSubmenu(title, items, ev) {
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
    if (!url) return;
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

  formatNavUrl = (nav = []) => {
    return nav.map(navItem => ({
      ...navItem,
      url: navItem?.url ? getBasePath(navItem?.url) : '',
      items: navItem?.items ? this.formatNavUrl(navItem?.items) : false,
    }));
  };

  render() {
    const localnavigation =
      (this.props.localnavigation?.length &&
        this.props.localnavigation?.filter(item => item.title !== 'Home')) ||
      [];
    const navigation = this.formatNavUrl(this.props.localnavigation?.items);

    // console.log('localnavigation', this.props.localnavigation);
    return (
      <React.Fragment>
        <BodyClass
          className={
            this.state.subMenu.items && this.state.subMenu.items.length
              ? 'contentpage menu-open-contentpage'
              : 'contentpage'
          }
        />

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
          <div ref={this.menuWrapperRef} className="first-level-wrapper">
            <MenuPosition
              className="first-level"
              expanded={
                this.state.subMenu.items && this.state.subMenu.items.length
              }
              setCurrentTop={this.setCurrentTop}
              topDistance={this.state.topDistance}
              currentTopDistance={this.state.currentTopDistance}
            >
              {navigation.map((item, index) => (
                <div
                  key={getPath(item['@id'])}
                  className={
                    this.isActive(getPath(item['@id']))
                      ? 'menu-item active'
                      : 'menu-item'
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
                      {this.isActive(getPath(item['@id'])) && (
                        <div className="menuExpanded" id="menuExpanded">
                          {item.items.find(
                            i =>
                              __CLIENT__ &&
                              window &&
                              window.location.href.includes(
                                getPath(i['@id']),
                              ) &&
                              window.location.href.includes('topics'),
                          ) ? (
                            <div
                              style={{
                                fontSize: '1.2rem',
                                textTransform: 'initial',
                                borderBottom: '1px solid #eee',
                              }}
                              key={getPath(
                                item.items.find(
                                  i =>
                                    __CLIENT__ &&
                                    window &&
                                    window.location.href.includes(
                                      getPath(i['@id']),
                                    ),
                                )['@id'],
                              )}
                            >
                              {
                                item.items.find(
                                  i =>
                                    __CLIENT__ &&
                                    window &&
                                    window.location.href.includes(
                                      getPath(i['@id']),
                                    ),
                                ).title
                              }
                            </div>
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
                                  {flattenToAppURL(
                                    this.props.pathname,
                                  ).includes(flattenToAppURL(item['@id'])) && (
                                    <span className="menuExpandedIndicator">
                                      <Icon name={rightCircle} size="20px" />
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
                    <Link
                      to={
                        getPath(item['@id']) === '' ? '/' : getPath(item['@id'])
                      }
                      key={getPath(item['@id'])}
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}
            </MenuPosition>
          </div>

          {this.state.subMenu.items && this.state.subMenu.items.length ? (
            <div
              className="second-level"
              style={{ paddingTop: this.state.currentTopDistance }}
            >
              <Icon
                name={backIcon}
                onClick={() => this.setSubmenu(this.state.subMenu.type, [])}
                className="mobile-back-button"
              />
              {this.state.subMenu.items.map(item => (
                <div
                  key={getPath(item['@id'])}
                  className={
                    this.isActive(getPath(item['@id']))
                      ? 'menu-item active'
                      : 'menu-item'
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
                    <Link
                      to={
                        getPath(item['@id']) === '' ? '/' : getPath(item['@id'])
                      }
                      key={getPath(item['@id'])}
                    >
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
            <div
              className="third-level"
              style={{ paddingTop: this.state.currentTopDistance }}
            >
              <Icon
                name={backIcon}
                onClick={() => this.setSubtopics(null, [])}
                className="mobile-back-button"
              />
              {/* TODO: delete this */}
              {/* <h2 style={{ fontWeight: 600 }}>
                <i>{this.state.subTopics.type}</i>
              </h2>
              <p style={{ fontWeight: 100 }} className="mb-5">
                Subtopics
              </p> */}
              {this.state.subTopics.items.map(item => (
                <div
                  key={getPath(item['@id'])}
                  className={
                    this.isActive(getPath(item['@id']))
                      ? 'menu-item active'
                      : 'menu-item'
                  }
                >
                  <Link
                    to={
                      item.items
                        ? getPath(item.items[0]['@id'])
                        : getPath(item['@id'])
                    }
                    key={getPath(item['@id'])}
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
  connect(
    (state, props) => ({
      localnavigation:
        state.prefetch?.[state.router.location.pathname]?.['@components']
          ?.localnavigation?.items ||
        (state.content.data &&
          state.content.data['@components'].localnavigation.items),
      // items:
      //   state.content.data &&
      //   state.content.data['@components'].navigation.items,
    }),
    {},
  ),
)(PageNavigation);
