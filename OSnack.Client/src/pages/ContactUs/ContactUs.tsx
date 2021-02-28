import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { TextArea } from 'osnack-frontend-shared/src/components/Inputs/TextArea';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import { AuthenticationContext } from 'osnack-frontend-shared/src/_core/Contexts/authenticationContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { usePostQuestionCommunication } from "osnack-frontend-shared/src/hooks/PublicHooks/useCommunicationHook";
import useScript from 'osnack-frontend-shared/src/hooks/function/useScript';
import { GooglereCAPTCHAKey } from 'osnack-frontend-shared/src/_core/appConst';

const ContactUs = (props: IProps) => {
   const isUnmounted = useRef(false);
   const captchaScript = useScript(`https://www.google.com/recaptcha/api.js?render=${GooglereCAPTCHAKey}`);
   const auth = useContext(AuthenticationContext);
   const errorAlert = useAlert(new AlertObj());
   const [contact, setContact] = useState(new Communication());
   const [message, setMessage] = useState("");

   useEffect(() => {
      return () => {
         isUnmounted.current = true;
         document.body.removeChild(document.getElementsByClassName("grecaptcha-badge")[0]!.parentNode!);
      };
   }, []);

   const sendMessage = (loadingCallBack?: () => void) => {
      if (captchaScript.isLoaded)
         try {

            // @ts-ignore
            grecaptcha.execute(GooglereCAPTCHAKey, { action: 'Contact' })
               .then((token: string) => {
                  contact.captchaToken = token;
                  contact.messages = [{ body: message }];
                  errorAlert.pleaseWait(isUnmounted);
                  usePostQuestionCommunication(contact)
                     .then(result => {
                        if (isUnmounted.current) return;
                        setMessage("");
                        loadingCallBack!();
                        errorAlert.setSingleSuccess("submit", result.data);
                     }).catch(errors => {
                        if (isUnmounted.current) return;
                        errorAlert.set(errors);
                        loadingCallBack && loadingCallBack!();
                     });
               });
         }
         catch {
            errorAlert.setSingleError("error", "Unable to process your request.");
            loadingCallBack && loadingCallBack!();
         }
      else {
         loadingCallBack!();
         errorAlert.setSingleSuccess("error", "reCAPTCHA is not loaded.");
      }
   };

   return (
      <>
         <PageHeader title="Get In Touch!" />
         <Container>
            <div className="row justify-content-center">
               <div className="col-12 col-md-6 pm-0 bg-white mb-3 pt-3 pb-3">
                  <Alert className="col-12 mb-2"
                     alert={errorAlert.alert}
                     onClosed={() => errorAlert.clear()} />
                  <div className="col-12 mt-auto mb-auto text-center">
                     <a className="col-12 phone-icon" children=" 078 6569 0055" href="tel:07865690055" />
                     <a className="col-12 email-icon" children=" support@osnack.co.uk" href="mailto:support@osnack.co.uk" />
                  </div>
                  {!auth.isAuthenticated &&
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
                  <div className="col-12 small-text text-gray">
                     {"This site is protected by reCAPTCHA and the Google "}
                     <a href="https://policies.google.com/privacy">Privacy Policy</a>{" and"}
                     <a href="https://policies.google.com/terms">Terms of Service</a>{" apply."}
                  </div>
                  <div className="col-12 mt-3">
                     <Button className="w-100 btn-lg btn-green"
                        children="Send"
                        onClick={sendMessage}
                        enableLoading={isUnmounted}
                        disabled={!navigator.cookieEnabled} />
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
      </>
   );
};

declare type IProps = {
};
export default ContactUs;
