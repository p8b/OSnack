import React from "react";
import Container from "./Container";

const Footer = () => {
   return (
      <footer id="footer" className="footer pt-4 align-self-end mt-3">
         <Container className="container-fluid">
            <div className="row m-0 p-0">
               <p className="col-12 text-center p-0 m-0 mt-2 cursor-default"
                  children={`© ${new Date().getFullYear()} OSnack`} />
            </div>
         </Container>
      </footer >
   );
};
export default Footer;
