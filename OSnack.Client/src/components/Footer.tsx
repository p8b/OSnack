import React from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

const Footer = () => {
   return (
      <footer id="footer" className="footer pt-4">
         <Container className="wide-container">
            <div className="row m-0 p-0">
               <div className="row col-12 justify-content-center p-0 m-0 mt-2  mb-2 ">
                  <div className="col-6 h5 pl-2 pr-2 m-0 text-right">
                     <Link to="/About">About</Link>
                  </div>
                  <div className="col-6 h5 pl-2 pr-2 m-0 text-left" >
                     <Link to="/Contact">Contact</Link>
                  </div>
               </div>
               <p className="col-12 text-center p-0 m-0 mt-2 cursor-default"
                  children={`© ${new Date().getFullYear()} OSnack`} />
            </div>
         </Container>
      </footer >
   );
};
export default Footer;
