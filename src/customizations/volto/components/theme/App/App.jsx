/**
 * App container.
 * @module components/theme/App/App
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { asyncConnect } from 'redux-connect';
import { Segment } from 'semantic-ui-react';
import Raven from 'raven-js';
import { renderRoutes } from 'react-router-config';
import { Slide, ToastContainer, toast } from 'react-toastify';
import split from 'lodash/split';
import join from 'lodash/join';
import trim from 'lodash/trim';
import cx from 'classnames';
import { Grid } from 'semantic-ui-react';

import Error from '@plone/volto/error';

import { Footer, Header, Icon, Messages } from '@plone/volto/components';
import { BodyClass, getBaseUrl, getView } from '@plone/volto/helpers';
import {
  getBreadcrumbs,
  getContent,
  getNavigation,
  getTypes,
  getWorkflow,
  purgeMessages,
} from '@plone/volto/actions';

import PageHeader from '~/components/theme/Header/PageHeader';
// import PageHeaderBg from '~/components/theme/Header/PageHeaderBg';

import clearSVG from '@plone/volto/icons/clear.svg';

/**
 * @export
 * @class App
 * @extends {Component}
 */
class App extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    purgeMessages: PropTypes.func.isRequired,
  };

  state = {
    hasError: false,
    error: null,
    errorInfo: null,
    hideMenu: false,
  };

  /**
   * ComponentDidMount
   * @method ComponentDidMount
   * @param {string} error  The error
   * @param {string} info The info
   * @returns {undefined}
   */
  componentDidMount() {
    if (__CLIENT__ && process.env.SENTRY_DSN) {
      Raven.config(process.env.SENTRY_DSN).install();
    }
  }

  /**
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.purgeMessages();

      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    }
  }

  checkProps(props) {
    const hideMenuConditions = ['add', 'edit', 'contents'];
    const pathname = props.pathname && props.pathname.split('/');
    const pageType = pathname[pathname.length - 1];
    if (hideMenuConditions.includes(pageType)) {
      return true;
    }
    return false;
  }

  /**
   * ComponentDidCatch
   * @method ComponentDidCatch
   * @param {string} error  The error
   * @param {string} info The info
   * @returns {undefined}
   */
  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, errorInfo: info });
    if (__CLIENT__ && process.env.SENTRY_DSN) {
      Raven.captureException(error, { extra: info });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    //
    const path = getBaseUrl(this.props.pathname);
    const action = getView(this.props.pathname);
    const hideMenu = this.checkProps(this.props);
    return (
      <Fragment>
        <BodyClass className={`view-${action}view`} />
        {/* <BodyClass className={this.props.pathname === '/' ? 'homepage' : ''} /> */}

        {/* Body class depending on sections */}
        <BodyClass
          className={cx({
            [trim(join(split(this.props.pathname, '/'), ' section-'))]:
              this.props.pathname !== '/',
            siteroot: this.props.pathname === '/',
          })}
        />
        {this.props.pathname === '/' ? (
          <React.Fragment>
            <Header
              actualPathName={this.props.pathname}
              homepage={true}
              pathname={path}
              navigationItems={this.props.navigation}
            />
            <Segment className="content-area">
              <main>
                <Messages />
                {this.state.hasError ? (
                  <Error
                    message={this.state.error.message}
                    stackTrace={this.state.errorInfo.componentStack}
                  />
                ) : (
                  renderRoutes(this.props.route.routes)
                )}
              </main>
            </Segment>
          </React.Fragment>
        ) : (
          <div className="content-page">
            <PageHeader />
            <Grid columns={3} divided>
              <Grid.Row>
                {!hideMenu && (
                  <Grid.Column
                    tablet={12}
                    computer={3}
                    largeScreen={3}
                    className="menu-hamburger left-menu-wrapper"
                  >
                    <Header
                      noBreadcrumbs={true}
                      actualPathName={this.props.pathname}
                      pathname={path}
                      homepage={false}
                      navigationItems={this.props.navigation}
                    />
                  </Grid.Column>
                )}

                <Grid.Column
                  tablet={12}
                  computer={hideMenu ? 12 : 6}
                  largeScreen={hideMenu ? 12 : 6}
                >
                  <main className="content-page">
                    <Messages />
                    <div className="editor-toolbar-wrapper" />
                    {this.state.hasError ? (
                      <Error
                        message={this.state.error.message}
                        stackTrace={this.state.errorInfo.componentStack}
                      />
                    ) : (
                      renderRoutes(this.props.route.routes)
                    )}
                  </main>
                </Grid.Column>
                {!hideMenu && (
                  <Grid.Column
                    tablet={12}
                    computer={3}
                    largeScreen={3}
                    className="inPageNavigation"
                  />
                )}
              </Grid.Row>
            </Grid>
          </div>
        )}
        <ToastContainer
          position={toast.POSITION.BOTTOM_CENTER}
          hideProgressBar
          transition={Slide}
          autoClose={5000}
          closeButton={
            <Icon
              className="toast-dismiss-action"
              name={clearSVG}
              size="18px"
            />
          }
        />
        <Footer />
      </Fragment>
    );
  }
}

export const __test__ = connect(
  (state, props) => ({ pathname: props.location.pathname }),
  { purgeMessages },
)(App);

export default compose(
  asyncConnect([
    {
      key: 'breadcrumbs',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getBreadcrumbs(getBaseUrl(location.pathname))),
    },
    {
      key: 'content',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getContent(getBaseUrl(location.pathname))),
    },
    {
      key: 'navigation',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getNavigation(getBaseUrl(location.pathname), 4)),
    },
    {
      key: 'types',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getTypes(getBaseUrl(location.pathname))),
    },
    {
      key: 'workflow',
      promise: ({ location, store: { dispatch } }) =>
        __SERVER__ && dispatch(getWorkflow(getBaseUrl(location.pathname))),
    },
  ]),
  connect(
    (state, props) => ({
      pathname: state.router.location.pathname, //props.location.pathname,
    }),
    { purgeMessages },
  ),
)(App);
