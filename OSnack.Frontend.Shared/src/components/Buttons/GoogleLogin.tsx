import React, { useEffect, useRef, useState } from 'react';
import { sleep, uuidv4 } from '../../_core/appFunc';
import { ExternalLoginDetails, RegistrationTypes } from '../../_core/apiModels';

const GoogleLogin = (props: IProps) => {
   const callBackWasCalled = useRef(false);
   const [loading, setLoading] = useState(false);
   const [disable, setDisable] = useState(false);
   const isWait = useRef(false);
   const isUnmounted = useRef(false);
   useEffect(() => () => {
      isWait.current = false;
      isUnmounted.current = true;
   }, []);
   const login = () => {
      if (props.enableLoading) {
         setDisable(true);
         isWait.current = true;
         sleep(500, props.enableLoading).then(() => {
            isWait.current && !isUnmounted.current &&
               setLoading(true);
         });
      }
      props.onClick!();
      localStorage.setItem("googleLogin", uuidv4());
      const windowPop: Window | null = window.open(`https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile&response_type=code&client_id=${props.clientId}&redirect_uri=${props.redirectURI}&state=${localStorage.getItem('googleLogin')}`,
         "_blank", "toolbar=no,location=no,status=no,menubar=no,width=400,height=500", false);


      let timer = setInterval(() => {
         if (windowPop!.closed) {
            clearInterval(timer!);
            if (!callBackWasCalled.current) {
               props.onClosedWithoutAction!();
               loadingCallBack();
            }
            else {
               callBackWasCalled.current = false;
            }
         }
      }, 1000);
      windowPop!.opener.callBack = () => {
         callBackWasCalled.current = true;
         const reply = windowPop!.document.location.search.replace("?state", "")!
            .replace("&code", "")!
            .replace("&scope", "")!
            .split('=');
         if (reply![1] != null && localStorage.getItem("googleLogin") === reply![1]) {
            if (props.enableLoading) {
               console.log("With loading callback");
               props.onSuccess!({
                  code: reply![2],
                  state: reply![1],
                  type: RegistrationTypes.Google,
                  rememberMe: false
               }, loadingCallBack);
            } else {
               console.log("WithOut loading callback");
               props.onSuccess({
                  code: reply![2],
                  state: reply![1],
                  type: RegistrationTypes.Google,
                  rememberMe: false
               }, undefined);
            }
            localStorage.removeItem("googleLogin");
         } else {
            loadingCallBack();
            props.onFailure("Google Login Failed. Cannot retrieve code!");
         }
      };
   };
   const loadingCallBack = () => {
      console.log("loadingCallBack ");
      if (props.enableLoading?.current || isUnmounted.current) return;
      setLoading(false);
      setDisable(false);
      isWait.current = false;
   };
   useEffect(() => {
      try {
         const reply = document.location.search.replace("?state", "")!
            .replace("&code", "")!
            .replace("&scope", "")!
            .split('=');
         if (reply![1] != null && localStorage.getItem("googleLogin") === reply![1]) {
            window.opener.callBack?.call(null);
            window.close();
         }
      } catch (e) { }
   });
   return <button children={props.children}
      className={`${props?.className} ${loading && "loading"}`}
      onClick={login}
      disabled={disable || false}
   />;
};
declare type IProps = {
   clientId: string,
   children: any,
   redirectURI: string,
   className?: string,
   enableLoading?: React.MutableRefObject<boolean>;
   onSuccess: (info: ExternalLoginDetails, loadingCallBack?: () => void) => void,
   onFailure: (msg: string) => void,
   onClick?: () => void,
   onClosedWithoutAction?: () => void,
};
export default GoogleLogin;
