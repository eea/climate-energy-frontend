import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default class HomepageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nav1: null,
      nav2: null,
      slides: []
    };
  }

//   static propTypes = {
//     token: PropTypes.string,
//     pathname: PropTypes.string.isRequired,
//   };

//   static defaultProps = {
//     token: null,
//   };
  
  async componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    });
    const slidesArr = Array.from({ length: 5 }, () => Math.floor(Math.random() * 5))
    const slidesUrl = await Promise.all(slidesArr.map(async (item, index) => {
      let response = await fetch('https://picsum.photos/1600/600');
      let data = await response.url
      return <div className="slider-slide" key={index}>
              <img src={data} alt=""/>
              <div className="slide-title">Nunc eget convallis orci, vel feugiant nicosa.</div>
            </div>
      })
    )
    this.setState({
      slides: slidesUrl
    })
  }


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

