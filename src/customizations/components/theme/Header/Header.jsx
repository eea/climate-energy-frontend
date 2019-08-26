/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Slider from "react-slick";
import { Anontools, Logo, Navigation, SearchWidget, Breadcrumbs, } from '@plone/volto/components';
import HeaderImage from '~/components/Header/HeaderImage';
import HomepageSlider from '~/components/Header/HomepageSlider';

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { throws } from 'assert';

/**
 * Header component class.
 * @class Header
 * @extends Component
 */
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHomepage: this.props.actualPathName === '/',
      url: null,
      description: null,
      title: null
    };
  }
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    actualPathName: PropTypes.string.isRequired,
    folderHeader: PropTypes.object
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };


  componentWillReceiveProps(nextProps) {
    if(nextProps.actualPathName !== this.props.actualPathName) {
      this.setState({
        isHomepage: nextProps.actualPathName === '/'
      })
      // this.props.getFrontpageSlides();
    }
    if(JSON.stringify(nextProps.folderHeader) !== JSON.stringify(this.props.folderHeader)) {
      this.setState({
        url: nextProps.folderHeader.url,
        description: nextProps.folderHeader.description,
        title: nextProps.folderHeader.title
      })
      // this.props.getFrontpageSlides();
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    
    return (
      <Segment basic className="header-wrapper" role="banner">
        <Container>
          <div className="header">
            <div className="logo-nav-wrapper space-between">
              <div className="logo">
                <Logo />
              </div>
              <Navigation pathname={this.props.pathname} />
            </div>
            <div className="nav-actions">
              <div className="search">
                <SearchWidget pathname={this.props.pathname} />
              </div>
              {!this.props.token && (
                <div className="tools">
                  <Anontools />
                </div>
              )}
            </div>
          </div>
          {(
            this.state.isHomepage ?
            <HomepageSlider></HomepageSlider>
            : 
            <div>
              <Breadcrumbs pathname={this.props.pathname} />
              <HeaderImage url={this.state.url}>
                <h1>{this.state.title}</h1>
                <p>{this.state.description}</p>
              </HeaderImage>
            </div>
          )}
        </Container>
      </Segment>
    );
  }
}

export default connect((state) => ({
  token: state.userSession.token,
}))(Header);
