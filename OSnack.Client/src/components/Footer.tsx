import { CustomRouteContext } from "osnack-frontend-shared/src/_core/Contexts/customRouteContext";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

const Footer = () => {
   const customRouteContext = useContext(CustomRouteContext);

   if (customRouteContext.maintenanceIsOn && !customRouteContext.isUserAllowedInMaintenance)
      return (<></>);
   return (
      <footer id="footer" className="footer pt-4 ">
         <Container>
            <div className="row pm-0">
               <div className="row col-12 justify-content-center pm-0 mt-2  mb-2 ">
                  <div className="col-12 col-md-6 mt-4 text-center mt-auto mb-auto">
                     <div className="h2" children="Follow Us!" />
                     <a className="col-12 facebook-icon-contact-page" href="https://www.facebook.com/OSNACK.CO.UK/" target="_blank"
                        rel="noreferrer" />
                     <a className="col-12 instagram-icon-contact-page" href="https://www.instagram.com/osnack.co.uk/" target="_blank"
                        rel="noreferrer" />
                  </div>
                  <div className="row col-12 col-md-6 h5 pl-2 pr-2 m-0 mt-4 text-center">
                     <div className="col-12 h5">
                        <Link to="/About">About Us</Link>
                     </div>
                     <div className="col-12 h5 mt-4">
                        <Link to="/Contact">Contact Us</Link>
                     </div>
                     <div className="col-12 mt-4">
                        <Link to="/TermsAndConditions">Terms And Conditions</Link>
                     </div>
                     <div className="col-12 mt-4">
                        <Link to="/PrivacyPolicy">Privacy Policy</Link>
                     </div>

                     <p className="col-12 text-center pm-0 mt-5 cursor-default"
                        children={`© ${new Date().getFullYear()} OSnack`} />
                     <p className="col-12 pm-0 text-center text-small cursor-default">Company registration No. 11274862</p>
                     <p className="col-12 pm-0 text-center text-small cursor-default">VAT Registration No. 290 8165 85</p>
                  </div>
               </div>
            </div>
         </Container>
      </footer >
   );
};
export default Footer;
