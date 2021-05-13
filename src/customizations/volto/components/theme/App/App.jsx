/**
 * App container.
 * @module components/theme/App/App
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { asyncConnect } from '@plone/volto/helpers';
import { Segment, Grid } from 'semantic-ui-react';
import { renderRoutes } from 'react-router-config';
import { Slide, ToastContainer, toast } from 'react-toastify';
import split from 'lodash/split';
import join from 'lodash/join';
import trim from 'lodash/trim';
import cx from 'classnames';
import config from '@plone/volto/registry';

import Error from '@plone/volto/error';

import {
  Breadcrumbs,
  Footer,
  Header,
  Icon,
  OutdatedBrowser,
  AppExtras,
  SkipLinks,
} from '@plone/volto/components';
import { BodyClass, getBaseUrl, getView, isCmsUi } from '@plone/volto/helpers';
import {
  getBreadcrumbs,
  getContent,
  getNavigation,
  getTypes,
  getWorkflow,
  purgeMessages,
} from '@plone/volto/actions';

import clearSVG from '@plone/volto/icons/clear.svg';
import MultilingualRedirector from '@plone/volto/components/theme/MultilingualRedirector/MultilingualRedirector';

import * as Sentry from '@sentry/browser';

import PageHeader from '~/components/theme/Header/PageHeader';
import { PluggablesProvider } from '@plone/volto/components/manage/Pluggable';
// import PageHeaderBg from '~/components/theme/Header/PageHeaderBg';

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
   * ComponentDidCatch
   * @method ComponentDidCatch
   * @param {string} error  The error
   * @param {string} info The info
   * @returns {undefined}
   */
  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, errorInfo: info });
    if (__CLIENT__) {
      if (window?.env?.RAZZLE_SENTRY_DSN || __SENTRY__?.SENTRY_DSN) {
        Sentry.captureException(error);
      }
    }
  }

  /**
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.purgeMessages();

      if (this.state.hasError) {
        this.setState({ hasError: false });
      }
    }
  }

  checkProps(props) {
    const hideMenuConditions = ['add', 'edit', 'contents'];
    const pathname = props.pathname?.split('/');
    const pageType = pathname[pathname.length - 1];
    if (hideMenuConditions.includes(pageType)) {
      return true;
    }
    return false;
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { views } = config;
    const path = getBaseUrl(this.props.pathname);
    const action = getView(this.props.pathname);
    const isCmsUI = isCmsUi(this.props.pathname);
    const hideMenu = this.checkProps(this.props);
    const ConnectionRefusedView = views.errorViews.ECONNREFUSED;
    return (
      <PluggablesProvider>
        <Fragment>
          <BodyClass className={`view-${action}view`} />
          {/* <BodyClass className={this.props.pathname === '/' ? 'homepage' : ''} /> */}
          {/* Body class depending on content type */}
          {this.props.content && this.props.content['@type'] && (
            <BodyClass
              className={`contenttype-${this.props.content['@type']
                .replace(' ', '-')
                .toLowerCase()}`}
            />
          )}

          {/* Body class depending on sections */}
          <BodyClass
            className={cx({
              [trim(join(split(this.props.pathname, '/'), ' section-'))]:
                this.props.pathname !== '/',
              siteroot: this.props.pathname === '/',
              'is-authenticated': !!this.props.token,
              'is-anonymous': !this.props.token,
              'cms-ui': isCmsUI,
              'public-ui': !isCmsUI,
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
              <MultilingualRedirector pathname={this.props.pathname}>
                <Segment basic className="content-area">
                  <main>
                    <OutdatedBrowser />
                    {this.props.connectionRefused ? (
                      <ConnectionRefusedView />
                    ) : this.state.hasError ? (
                      <Error
                        message={this.state.error.message}
                        stackTrace={this.state.errorInfo.componentStack}
                      />
                    ) : (
                      renderRoutes(this.props.route.routes, {
                        staticContext: this.props.staticContext,
                      })
                    )}
                  </main>
                </Segment>
              </MultilingualRedirector>
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
          <AppExtras {...this.props} />
        </Fragment>
      </PluggablesProvider>
    );
  }
}

export const __test__ = connect(
  (state, props) => ({
    pathname: props.location.pathname,
    token: state.userSession.token,
    content: state.content.data,
    apiError: state.apierror.error,
    connectionRefused: state.apierror.connectionRefused,
  }),
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
        __SERVER__ &&
        dispatch(
          getNavigation(
            getBaseUrl(location.pathname),
            config.settings.navDepth,
          ),
        ),
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
      pathname: state.router.location.pathname,
      token: state.userSession.token,
      content: state.content.data,
      apiError: state.apierror.error,
      connectionRefused: state.apierror.connectionRefused, //props.location.pathname,
    }),
    { purgeMessages },
  ),
)(App);
