import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';
import { BodyClass } from '@plone/volto/helpers';

import {
  Logo,
  Navigation,
  SearchWidget,
  Breadcrumbs,
} from '@plone/volto/components';
import PageNavigation from '~/components/theme/Header/PageNavigation';

class Header extends Component {
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: null,
  };

  render() {
    return (
      <div className="header-wrapper" role="banner">
        {!this.props.token && <BodyClass className="anonymous" />}
        {this.props.homepage || this.props.noBreadcrumbs ? (
          ''
        ) : (
          <Breadcrumbs pathname={this.props.pathname} />
        )}
        {this.props.homepage ? (
          <React.Fragment>
            <div className="headerTop">
              <div className="homepageHeader">
                <Logo isHomepage={this.props.actualPathName === '/' || false} />
                <div className="searchbar">
                  <SearchWidget pathname={this.props.pathname} />
                </div>
              </div>
            </div>
            <Navigation
              isHomepage={this.props.homepage}
              pathname={this.props.pathname}
            />
          </React.Fragment>
        ) : (
          <PageNavigation
            isHomepage={this.props.homepage}
            pathname={this.props.pathname}
          />
        )}
      </div>
    );
  }
}

export default connect(state => ({
  token: state.userSession.token,
  pathname: state.router.location ? state.router.location.pathname : '',
}))(Header);
