import React from "react";
import Container from "./Container";

const Footer = () => {
   return (
      <footer className="footer pt-4 align-self-end mt-3">
         <Container className="container-fluid">
            <div className="row pm-0">
               <p className="col-12 text-center pm-0 mt-2 cursor-default"
                  children={`© ${new Date().getFullYear()} OSnack`} />
            </div>
         </Container>
      </footer >
   );
};
export default Footer;
