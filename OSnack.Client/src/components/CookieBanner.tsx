import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";
import useScript from "osnack-frontend-shared/src/hooks/function/useScript";
import { getCookieValue, setCookie } from "osnack-frontend-shared/src/_core/appFunc";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import Container from "./Container";

const CookieBanner = () => {
   const [cookieUserConsent, setCookieUserConsent] = useState("");
   const [currentUrl, setCurrentUrl] = useState<string | null>(null);
   const googleAnalytic = useScript(currentUrl);
   const cookieName = "CookieUserConsent";
   const [show, setShow] = React.useState(false);

   useEffect(() => {
      setTimeout(() => {
         setShow(true);
      }, 1);
   }, [show]);

   useEffect(() => {
      fetch(`${window.location.origin}/public/markdowns/CookieUserConsent.md`).then((result) => {
         if (result.status == 200)
            result.text().then(termsAndCondition => {
               setCookieUserConsent(termsAndCondition);
            });
      });
      if (getCookieValue(cookieName) !== "")
         setGoogleAScript(getCookieValue(cookieName) === "true");
   }, []);

   const setGoogleAScript = (value: boolean) => {
      if (value)
         setCurrentUrl("https://www.googletagmanager.com/gtag/js?id=G-6Q00CYCVPL");
      else
         setCurrentUrl("");

      if (getCookieValue(cookieName) === "")
         setCookie(cookieName, value, 356);
   };

   if (getCookieValue(cookieName) === "true") {
      if (googleAnalytic.isLoaded) {
         // @ts-ignore
         window.dataLayer = window.dataLayer || [];
         // @ts-ignore
         function gtag() { dataLayer.push(arguments); }
         // @ts-ignore
         gtag('js', new Date());
         // @ts-ignore
         gtag('config', 'G-6Q00CYCVPL');
      }
   }

   if (getCookieValue(cookieName) !== '' || !show) return <></>;

   return (
      <div className=" pos-b-sticky shadow-top bg-white justify-content-center py-4 py-md-5">
         <Container>
            {!navigator.cookieEnabled ?
               <div className="display-6 text-center">Your browser has blocked cookies.<br />
                  Please enable cookies in your Web browser.<br />
                  <Link to="/PrivacyPolicy">Privacy Policy</Link>
               </div>
               :
               <div className="col ml-auto mr-auto">
                  <ReactMarkdown>{cookieUserConsent}</ReactMarkdown>
                  <div className="row justify-content-center ">
                     <Button className="col-auto mt-2"
                        children="Only Necessary"
                        onClick={() => { setGoogleAScript(false); }} />
                     <Button className="col-12 col-md-4 ml-md-3 btn-green btn-lg mt-2"
                        children="Allow Cookies"
                        onClick={() => { setGoogleAScript(true); }} />
                  </div>
               </div>
            }
         </Container>
      </div>
   );
};
export default CookieBanner;
