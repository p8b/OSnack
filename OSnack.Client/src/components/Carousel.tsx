import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const Carousel = (props: IProps) =>
   <AliceCarousel
      items={props.items}
      responsive={{
         256: { items: 1 },
         500: { items: 2 },
         1000: { items: 3 },
         1260: { items: 4 },
         1515: { items: 5 },
         1920: { items: 6 }
      }}
      animationType="slide"
      animationDuration={2000}
      autoPlayInterval={3000}
      autoPlay={true}
      mouseTracking={false}
      infinite
      disableDotsControls
      disableButtonsControls
   />;
declare type IProps = {
   items: any[];
};
export default Carousel;
