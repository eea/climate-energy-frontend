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
import HeaderImage from './HeaderImage';

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
      nav1: null,
      nav2: null,
      slides: []
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
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };
  
  async componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
    const slidesArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5))
    const slidesUrl = await Promise.all(slidesArr.map(async (item, index) => {
      let response = await fetch('https://loremflickr.com/1600/760');
      let data = await response.url
      return <div key={index}>
              <img src={data} alt=""/>
            </div>
      })
    )
    this.setState({
      slides: slidesUrl
    })
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const settings = {
      dots: false,
      infinite: true,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  
    return (
      <Segment basic className="header-wrapper" role="banner">
        <Container>
          <div className="header">
            <div className="logo-nav-wrapper">
              <div className="logo">
                <Logo />
              </div>
              <Navigation pathname={this.props.pathname} />
            </div>
            {!this.props.token && (
              <div className="tools">
                <Anontools />
              </div>
            )}
            <div className="search">
              <SearchWidget pathname={this.props.pathname} />
            </div>
          </div>
          {(!this.props.pathname ?
            this.state.slides.length ? 
            <div className="slider-wrapper">
              <Slider
                className="mainSlider"
                asNavFor={this.state.nav2}
                ref={slider => (this.slider1 = slider)}
                {...settings}
                >
                {this.state.slides}
              </Slider>
              <Slider
                className="navSlider"
                asNavFor={this.state.nav1}
                ref={slider => (this.slider2 = slider)}
                slidesToShow={3}
                swipeToSlide={true}
                focusOnSelect={true}
              >
                {this.state.slides}
              </Slider>
            </div>
            : 
            ''
            :
            <div>
              <Breadcrumbs pathname={this.props.pathname} />
              <HeaderImage url="https://picsum.photos/id/252/1920/600"></HeaderImage>
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
