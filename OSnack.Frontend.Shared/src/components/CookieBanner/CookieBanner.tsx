import { Button } from "../Buttons/Button";
import useScript from "../../hooks/function/useScript";
import { getCookieValue, setCookie } from "../../_core/appFunc";
import React, { useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { CustomRouteContext } from "../../_core/Contexts/customRouteContext";
import { GoogleAnalyticKey, MainWebsiteURL } from "../../_core/appConst";

const CookieBanner = () => {
   const maintenance = useContext(CustomRouteContext);
   const [cookieUserConsent, setCookieUserConsent] = useState("");
   const [currentUrl, setCurrentUrl] = useState<string | null>(null);
   const googleAnalytic = useScript(currentUrl);
   const cookieName = "CookieUserConsent";
   const [show, setShow] = React.useState(false);

   useEffect(() => {
      setTimeout(() => {
         setShow(true);
      }, navigator.cookieEnabled ? 10 : 1000);
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
         setCurrentUrl(`https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticKey}`);
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
         gtag('config', GoogleAnalyticKey);
      }
   }
   if (maintenance.maintenanceIsOn || !maintenance.isUserAllowedInMaintenance)
      return (<></>);
   if (getCookieValue(cookieName) !== '' || !show) return <></>;

   return (
      <div className="cookie-banner justify-content-center py-4 py-md-5">
         <div className="container">
            {!navigator.cookieEnabled ?
               <div className="display-6 text-center">
                  Your browser has blocked cookies.<br />
                  Please enable cookies in your Web browser.<br />
                  <Link to={`${MainWebsiteURL}"/PrivacyPolicy"`}>Privacy Policy</Link>
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
