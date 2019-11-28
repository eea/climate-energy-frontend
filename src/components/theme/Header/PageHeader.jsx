import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Logo, SearchWidget } from '@plone/volto/components';

class PageHeader extends Component {
  constructor(props) {
    super(props);
    this.setHomepageClass = this.setHomepageClass.bind(this);
    this.state = {
      isHomepage: this.props.actualPathName === '/',
    };
  }

  static propTypes = {
    pathname: PropTypes.string.isRequired,
  };

  setHomepageClass(is) {
    const body = document.getElementById('main');
    return is
      ? body.classList.add('homepage')
      : body.classList.remove('homepage');
  }

  componentDidMount() {
    this.setHomepageClass(this.state.isHomepage);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.actualPathName !== this.props.actualPathName) {
      this.setHomepageClass(nextProps.actualPathName === '/');
      this.setState({
        isHomepage: nextProps.actualPathName === '/',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.actualPathName !== this.props.actualPathName) {
      this.setHomepageClass(this.props.actualPathName === '/');
      this.setState({
        isHomepage: this.props.actualPathName === '/',
      });
    }
  }

  render() {
    return (
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="header">
          <Logo isHomepage={this.state.isHomepage} />
          <div className="searchbar">
            <SearchWidget pathname={this.props.pathname} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  // token: state.userSession.token,
  pathname: state.router.location ? state.router.location.pathname : '',
}))(PageHeader);
