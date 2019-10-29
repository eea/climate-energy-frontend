import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Anontools,
  Logo,
  Navigation,
  SearchWidget,
  Breadcrumbs,
} from '@plone/volto/components';
import PageNavigation from '~/components/theme/Header/PageNavigation';

class Header extends Component {
  constructor(props) {
    super(props);
    this.setHomepageClass = this.setHomepageClass.bind(this);
    this.state = {
      isHomepage: this.props.actualPathName === '/',
    };
  }
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
  };

  static defaultProps = {
    token: null,
  };

  setHomepageClass(is) {
    const body = document.getElementById('main');
    console.log('setting', is, body);
    if (is) {
      body.classList.add('homepage');
      return;
    }
    body.classList.remove('homepage');
  }
  componentDidMount() {
    this.setHomepageClass(this.state.isHomepage);
  }
  componentWillReceiveProps(nextProps) {
    console.log('alala', nextProps);
    if (nextProps.actualPathName !== this.props.actualPathName) {
      this.setHomepageClass(nextProps.actualPathName === '/');
      this.setState({
        isHomepage: nextProps.actualPathName === '/',
      });
    }
  }
  componentDidUpdate(prevProps) {
    console.log('didupdate', prevProps);
    if (prevProps.actualPathName !== this.props.actualPathName) {
      this.setHomepageClass(this.props.actualPathName === '/');
      this.setState({
        isHomepage: this.props.actualPathName === '/',
      });
    }
  }
  render() {
    return (
      <div className="header-wrapper" role="banner">
        <div id="app-menu">
          {this.state.isHomepage || this.props.noBreadcrumbs ? (
            ''
          ) : (
            <Breadcrumbs pathname={this.props.pathname} />
          )}
          {this.props.noBreadcrumbs ? (
            ''
          ) : (
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="header">
                <Logo isHomepage={this.props.actualPathName === '/' || false} />
                <div className="searchbar">
                  <SearchWidget pathname={this.props.pathname} />
                </div>
              </div>
            </div>
          )}
          {this.state.isHomepage ? (
            <Navigation
              isHomepage={this.state.isHomepage}
              pathname={this.props.pathname}
            />
          ) : (
            <PageNavigation
              isHomepage={this.state.isHomepage}
              pathname={this.props.pathname}
            />
          )}
          {!this.props.token && (
            <div className="tools">
              <Anontools />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  token: state.userSession.token,
}))(Header);
