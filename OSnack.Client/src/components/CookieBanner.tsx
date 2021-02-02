import { Button } from "osnack-frontend-shared/src/components/Buttons/Button";
import useScript from "osnack-frontend-shared/src/hooks/function/useScript";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CookieContext, CookieType } from "../_core/cookieContext";

const CookieBanner = () => {
   const cookieCtx = useContext(CookieContext);
   const googleAnalytic = useScript("");

   useEffect(() => {
      if (cookieCtx.state.type !== CookieType.onlyNecessary) {
         googleAnalytic.set("https://www.googletagmanager.com/gtag/js?id=G-7HL1343EH1");
      }
      else {
         googleAnalytic.set("");
      }
   }, [cookieCtx.state.type]);

   if (cookieCtx.state.type !== CookieType.onlyNecessary) {
      if (googleAnalytic.isLoaded) {
         // @ts-ignore
         window.dataLayer = window.dataLayer || [];
         // @ts-ignore
         function gtag() { dataLayer.push(arguments); }
         // @ts-ignore
         gtag('js', new Date());
         // @ts-ignore
         gtag('config', 'G-7HL1343EH1');
      }
   }


   if (cookieCtx.state.type !== CookieType.none) return <></>;

   return (

      <div className=" pos-b-sticky bg-white justify-content-center p-1  ">
         <div className="col col-md-6 ml-auto mr-auto">
            <div className="font-weight-bold">This website uses cookies</div>
            <div>Like any other website, OSnack uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimise the users' experience by customising our web page content based on visitors' browser type and/or other information. <Link to="/PrivacyPolicy">Privacy Policy</Link></div>
            <div className="row justify-content-center">
               <Button className="col-auto btn-sm"
                  children="Accept Necessary"
                  onClick={() => { cookieCtx.set(CookieType.onlyNecessary); }} />
               <Button className="col-auto ml-1 btn-sm btn-green"
                  children="Allow Cookies"
                  onClick={() => { cookieCtx.set(CookieType.all); }} />
            </div>
         </div>
      </div>
   );
};
export default CookieBanner;
