import React from 'react';
import { Carousel } from 'antd';
import PropTypes from 'prop-types';
import CarouselStyle from './Carousel.css';

const DynamicCarousel = ({ items, autoplay }) => (

  <Carousel autoplay={autoplay}>
    {items.map((item, index) => (
      <div key={index} >
       <img src={item} style={{width:"30rem", height:"30rem", borderRadius:"12px"}}/>
      </div>
    ))}
  </Carousel>
);



export default DynamicCarousel;
