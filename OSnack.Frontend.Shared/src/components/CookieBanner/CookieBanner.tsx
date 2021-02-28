import { Button } from "../Buttons/Button";
import useScript from "../../hooks/function/useScript";
import { getCookieValue, setCookie, sleep } from "../../_core/appFunc";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { GoogleAnalyticKey, MainWebsiteURL } from "../../_core/appConst";

const CookieBanner = () => {
   const isUnmounted = useRef(false);
   const [cookieUserConsent, setCookieUserConsent] = useState("");
   const [currentUrl, setCurrentUrl] = useState<string | null>(null);
   const googleAnalytic = useScript(currentUrl);
   const cookieName = "CookieUserConsent";
   const [show, setShow] = React.useState(false);

   useEffect(() => {
      fetch(`${window.location.origin}/public/markdowns/CookieUserConsent.md`).then((result) => {
         if (result.status == 200)
            result.text().then(termsAndCondition => {
               setCookieUserConsent(termsAndCondition);
            });
      });
      if (getCookieValue(cookieName) !== "")
         setGoogleAScript(getCookieValue(cookieName) === "true");

      return () => {
         isUnmounted.current = true;
      };
   }, []);

   useEffect(() => {
      sleep(navigator.cookieEnabled ? 10 : 1000, isUnmounted)
         .then(() => { setShow(true); });
   }, [show]);

   useEffect(() => {
      if (googleAnalytic.isLoaded && getCookieValue(cookieName) === "true") {
         // @ts-ignore
         window.dataLayer = window.dataLayer || [];
         // @ts-ignore
         function gtag() { dataLayer.push(arguments); }
         // @ts-ignore
         gtag('js', new Date());
         // @ts-ignore
         gtag('config', GoogleAnalyticKey);
      }
   }, [googleAnalytic.isLoaded]);


   const setGoogleAScript = (value: boolean) => {
      if (value)
         setCurrentUrl(`https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticKey}`);
      else
         setCurrentUrl("");

      if (getCookieValue(cookieName) === "")
         setCookie(cookieName, value, 356);
   };

   if (getCookieValue(cookieName) !== '' || !show) return <></>;

   return (
      <div className="cookie-banner justify-content-center py-4 py-md-5">
         <div className="container">
            {!navigator.cookieEnabled ?
               <div className="display-6 text-center">
                  Your browser has blocked cookies.<br />
                  Please enable cookies in your Web browser.<br />
                  <a href={`${MainWebsiteURL}"/PrivacyPolicy"`}>Privacy Policy</a>
               </div>
               :
               <div className="row justify-content-center ">
                  <ReactMarkdown className="col-12">{cookieUserConsent}</ReactMarkdown>
                  <Button className="col-auto mt-2"
                     children="Only Necessary"
                     onClick={() => { setGoogleAScript(false); }} />
                  <Button className="col-12 col-md-4 ml-md-3 btn-green btn-lg mt-2"
                     children="Allow Cookies"
                     onClick={() => { setGoogleAScript(true); }} />
               </div>
            }
         </div>
      </div>
   );
};
export default CookieBanner;
