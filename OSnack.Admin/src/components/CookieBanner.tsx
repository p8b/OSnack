import React from "react";
import Container from "./Container";

const CookieBanner = () => {

   if (navigator.cookieEnabled) return <></>;

   return (
      <div className=" pos-b-sticky shadow-top bg-white justify-content-center p-5">
         <Container>
            <div className="display-6 text-center">Your browser has blocked cookies.<br />
                  Please enable cookies in your Web browser.
            </div>
         </Container>
      </div>
   );
};
export default CookieBanner;
