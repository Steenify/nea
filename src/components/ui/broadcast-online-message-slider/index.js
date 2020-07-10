import React, { useState } from 'react';
import Slider from 'react-slick';

import { ReactComponent as CloseIcon } from 'assets/svg/close-white.svg';

const BG_COLORS = {
  low: 'yellow',
  medium: '#f58220',
  high: 'red',
};

const BroadcastMessageSlider = (props) => {
  const { messages, onClose } = props;
  const [backgroundColor, setBackgroundColor] = useState(BG_COLORS[messages[0]?.urgency || 'low']);

  const settings = {
    dots: true,
    dotsClass: 'd-flex m-0 slick-dots-white',
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 10000,
    pauseOnHover: true,
    beforeChange: (_, index) => {
      setBackgroundColor(BG_COLORS[messages[index]?.urgency || 'low']);
    },
  };

  return (
    <div style={{ backgroundColor }}>
      <div className="container d-flex align-items-center">
        <div className="text-center w-100" style={{ color: 'bold' }}>
          <Slider {...settings}>
            {messages.map((message, index) => (
              <div key={`${index + 1}`}>
                <p className="p-2 m-0">{message.messageContent}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div>
          <span className="cursor-pointer" onClick={onClose}>
            <CloseIcon width={36} height={36} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default BroadcastMessageSlider;
