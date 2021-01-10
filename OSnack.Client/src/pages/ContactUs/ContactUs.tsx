import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { usePostQuestionCommunication } from "osnack-frontend-shared/src/hooks/PublicHooks/useCommunicationHook";
import {
   useGoogleReCaptcha
} from 'react-google-recaptcha-v3';

const ContactUs = (props: IProps) => {
   const isUnmounted = useRef(false);
   const auth = useContext(AuthContext);
   const errorAlert = useAlert(new AlertObj());
   const [contact, setContact] = useState(new Communication());
   const [message, setMessage] = useState("");
   const [showSuccess, setShowSuccess] = useState(false);
   const { executeRecaptcha } = useGoogleReCaptcha();
   useEffect(() => () => { isUnmounted.current = true; }, []);

   const sendMessage = () => {
      executeRecaptcha("Contact").then((token) => {
         errorAlert.PleaseWait(500, isUnmounted);
         contact.captchaToken = token;
         contact.messages = [{ body: message }];
         usePostQuestionCommunication(contact)
            .then(result => {
               if (isUnmounted.current) return;
               setMessage("");
               errorAlert.setSingleSuccess("submit", result.data);
               setShowSuccess(true);
            }).catch(errors => {
               if (isUnmounted.current) return;
               errorAlert.set(errors);
            });
      });


   };

   return (
      <>
         <PageHeader title="Get In Touch!" />
         <Container>
            <div className="row justify-content-center">
               <div className="col-12 col-md-6 pm-0 bg-white mb-3 pt-3 pb-3">
                  <Alert className="col-12 mb-2"
                     alert={errorAlert.alert}
                     onClosed={() => { errorAlert.clear(); setShowSuccess(false); }} />
                  {!showSuccess &&
                     <>
                        <div className="col-12 mt-auto mb-auto text-center">
                           <a className="col-12 phone-icon" children=" 078 6569 0055" href="tel:07865690055" />
                           <a className="col-12 email-icon" children=" support@osnack.co.uk" href="mailto:support@osnack.co.uk" />
                        </div>
                        {!auth.state.isAuthenticated &&
                           <>
                              < Input className="col-12" label="Name*"
                                 value={contact.fullName} onChange={(i) => { setContact({ ...contact, fullName: i.target.value }); }}
                              />
                              <Input className="col-12" label="Email*"
                                 value={contact.email} onChange={(i) => { setContact({ ...contact, email: i.target.value }); }}
                              />
                           </>
                        }

                        <TextArea className="col-12" label="Message*" rows={3} value={message}
                           onChange={(i) => { setMessage(i.target.value); }} />
                        <div className="col-12 mt-3">
                           <Button className="w-100 btn-lg btn-green" children="Send" onClick={sendMessage} />
                        </div>
                     </>
                  }
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
      </>
   );
};

declare type IProps = {
};
export default ContactUs;
