// components/ImageSwiper.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';  // Import swiper styles
import 'swiper/css';


const ImageSwiper = () => {
  const images = [
    '/images/image1.jpg',  // Add the paths to your images
    '/images/image2.jpg',
    '/images/image3.jpg',
    '/images/image4.jpg',
    '/images/image5.jpg',
    '/images/image6.jpg'
  ];

  return (
    <div className="swiper-container">
      <div className="logo">
        <img src="/logo.png" alt="Logo" />
        <p>Invest in yourself. Start your financial journey today.</p>
      </div>
      <Swiper spaceBetween={50} slidesPerView={3} loop={true}>
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt={`Slide ${index + 1}`} className="swiper-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSwiper;
