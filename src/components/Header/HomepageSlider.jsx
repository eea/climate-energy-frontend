import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Icon } from '@plone/volto/components';

import {
  getFrontpageSlides
} from '~/actions';

import Slider from "react-slick";
import left from '@plone/volto/icons/left-key.svg';
import right from '@plone/volto/icons/right-key.svg';


// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="slideArrow nextArrow"
      onClick={onClick}
    >
      <Icon name={right} size="25px"/>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="slideArrow prevArrow"
      onClick={onClick}
    >
      <Icon name={left} size="25px"/>
    </div>
  );
}

class HomepageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      slides: []
    };
    this.getSlides = this.getSlides.bind(this);
    // this.SampleNextArrow = this.SampleNextArrow.bind(this);
  }

  componentWillMount() {
    this.props.getFrontpageSlides();
  }

  // componentWillReceiveProps(nextProps) {
  //     this.props.getFrontpageSlides();
  // }

  static propTypes = {
    getFrontpageSlides: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string
      }),
    ).isRequired,
  };

  getSlides() {
     
      console.log(this.props.items)
      const slidesUrl = this.props.items.map((item, index) => {
        return <div className="slider-slide" key={index}>
                <div className="slider-image" style={{backgroundImage: `url(${item.image})`}}></div>
                <div className="slide-body">
                  <div className="slide-title">{item.title}</div>
                  <div className="slide-description">{item.description}</div>
                </div>
            </div>
      })
      this.setState({
        slides: slidesUrl
      })
      this.setState({
        nav1: this.slider1,
        nav2: this.slider2
      });
  }

  async componentDidMount() {
    if(this.props.items.length) {
      this.getSlides()
    } else {
      this.setState({
        slides: []
      })
    }
  }
  componentDidUpdate(prevProps) {
    if(JSON.stringify(this.props.items) !== JSON.stringify(prevProps.items)) {
      this.getSlides();
    }
  } 

  render() {

    const settings = {
      dots: false,
      infinite: true,
      lazyLoad: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };
    if(!this.state.slides.length) return ''
    return (
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
    );
  }
}

export default compose(
  connect(
    state => ({
      items: state.frontpage_slides.items,
    }),
    { getFrontpageSlides },
  ),
)(HomepageSlider);
