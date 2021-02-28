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
      <div className={`row pm-0 hero-container vh-100 ${heroImgLoaded ? "imgLoaded" : ""} `}>
         <div className="m-auto bg-dark-blur p-1 p-md-5 text-white text-center">
            <div className="logo-container ml-md-auto mr-auto pt-1 pl-2 pl-md-0">
               <img id="logo" alt="Logo" className="Logo" src="/public/images/logo.png" />
            </div>
            <div className="text-white col-12 pm-0 display-4 text-center">
               Under Construction.
            </div>
            <div className="text-white col-12 display-6 mt-3 text-center">
               {props.CannotReachServer &&
                  <>
                     Server is unavalible
                     <div className="col-12 mt-3" />
                  </>
               }
               We apologize for any inconvenience this may have caused.
               <div className="col-12 mt-3" />
               We will be back soon
            </div>
            <div className="col-12 text-center mt-3">
               <div className="h2" children="Follow Us!" />
               <a className="col-12 facebook-icon-contact-page text-white" href="https://www.facebook.com/OSNACK.CO.UK/" target="_blank"
                  rel="noreferrer" />
               <a className="col-12 instagram-icon-contact-page text-white" href="https://www.instagram.com/osnack.co.uk/" target="_blank"
                  rel="noreferrer" />
            </div>
         </div>
      </div>
   );
};
declare type IProps = {
   CannotReachServer?: boolean;
};
export default Maintenance;
