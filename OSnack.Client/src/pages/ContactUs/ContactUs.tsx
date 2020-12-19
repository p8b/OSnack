
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React from 'react';
import Container from '../../components/Container';
const ContactUs = (props: IProps) => {
   return (
      <Container>
         <PageHeader title="Get In Touch!" />
         <div className="row justify-content-center">
            <div className="col-12 col-md-6 pm-0 bg-white mb-3 pt-3 pb-3">
               <div className="col-12 mt-auto mb-auto text-center">
                  <div className="h2" children="Contact Us!" />
                  <a className="col-12 phone-icon" children=" 07865690055" href="tel:07865690055" />
                  <a className="col-12 email-icon" children=" osnack.cs@gmail.com" href="mailto:osnack.cs@gmail.com" />
               </div>
               <Input className="col-12" label="Name*" value="" onChange={(val) => { }} />
               <Input className="col-12" label="Email*" value="" onChange={(val) => { }} />
               <Input className="col-12" label="Subject" value="" onChange={(val) => { }} />
               <TextArea className="col-12" label="Message*" rows={3} value="" onChange={(val) => { }} />
               <div className="col-12 mt-3">
                  <Button className="w-100 btn-lg btn-green" children="Send" />
               </div>
            </div>
            <div className="col-12 col-md-6 text-center pm-0 mt-2 mb-3 pt-3 pb-3">
               <div className="col-12 pm-0 pos-sticky">
                  <div className="col-12">
                     <div className="h2" children="Follow Us!" />
                     <a className="col-12 facebook-icon-contact-page" href="https://www.facebook.com/OSNACK.CO.UK/" target="_blank" />
                     <a className="col-12 instagram-icon-contact-page" href="https://www.instagram.com/osnack.co.uk/" target="_blank" />
                  </div>
                  <div className="col-12 mt-5 mb-5">
                     {/***** <a className="map-marker-icon-contact-page mb-2" href="http://maps.google.com/?q=NW107XP" /> ****/}
                     <div className="map-marker-icon-contact-page mb-2" />
                     <div className="col-12" children="Suite S7 Rays House" />
                     <div className="col-12" children="North Circular Road" />
                     <div className="col-12" children="London" />
                     <div className="col-12" children="NW10 7XP" />
                  </div>
               </div>
            </div>

         </div>
      </Container>
   );
};

declare type IProps = {
};
export default ContactUs;
