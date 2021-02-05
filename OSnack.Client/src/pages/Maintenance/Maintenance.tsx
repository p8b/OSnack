import React, { useEffect, useRef, useState } from 'react';

const Maintenance = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [heroImgLoaded, setHeroImgLoaded] = useState(false);

   useEffect(() => {
      var img = new Image();
      img.src = "public/images/hero-img.png";
      img.onload = () => {
         setHeroImgLoaded(true);
      };
      return () => { isUnmounted.current = true; };
   }, []);

   return (
      <div className={`row pm-0 hero-container h-100 ${heroImgLoaded ? "imgLoaded" : ""} `}>
         <div className="m-auto bg-dark-blur p-1 p-md-5 text-white text-center">
            <img className="col-12 logo mb-3 mb-md-5" src="/public/images/logo.png" alt="OSnack Logo" />
            <div className="text-white col-12 display-4 text-center">
               Under Construction.
            </div>
            <div className="text-white col-12 display-6 mt-3 text-center">
               We apologize for any inconvenience this may have caused.
               <div className="col-12 mt-3" />
               We will be back soon
            </div>
         </div>
      </div>
   );
};
declare type IProps = {
};
export default Maintenance;
