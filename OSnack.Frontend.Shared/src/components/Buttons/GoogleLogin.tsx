import React from 'react';
import { uuidv4 } from '../../_core/appFunc';
import { ExternalLoginInfo } from '../../_core/apiModels';
import { RegistrationTypes } from '../../_core/constant.Variables';
const GoogleLogin = (props: IProps) => {
   let callBackWasCalled = false;
   const login = () => {
      props.onClick!();
      localStorage.setItem("googleLogin", uuidv4());
      const windowPop: Window | null = window.open(`https://accounts.google.com/o/oauth2/v2/auth?scope=email+profile&response_type=code&client_id=${props.clientId}&redirect_uri=${props.redirectURI}&state=${localStorage.getItem('googleLogin')}`,
         "_blank", "toolbar=no,location=no,status=no,menubar=no,width=400,height=500", false);

      let timer = setInterval(() => {
         if (windowPop!.closed) {
            clearInterval(timer!);
            if (!callBackWasCalled)
               props.onClosedWithoutAction!();
            else
               callBackWasCalled = false;
         }
      }, 1000);
      windowPop!.opener.callBack = () => {
         callBackWasCalled = true;
         const reply = windowPop!.document.location.search.replace("?state", "")!.replace("&code", "")!.replace("&scope", "")!.split('=');
         if (reply![1] != null && localStorage.getItem("googleLogin") === reply![1]) {
            props.onSuccess(new ExternalLoginInfo(reply![2], reply![1], RegistrationTypes.Google));
            localStorage.removeItem("googleLogin");
         } else props.onFailure("Google Login Failed. Cannot retrieve code!");
      };
   };
   try {
      const reply = document.location.search.replace("?state", "")!.replace("&code", "")!.replace("&scope", "")!.split('=');
      if (reply![1] != null && localStorage.getItem("googleLogin") === reply![1]) {
         window.opener.callBack?.call(null);
         window.close();
      }
   } catch (e) { }
   return <button children={props.children}
      className={props?.className}
      onClick={login}
   />;
};
declare type IProps = {
   clientId: string,
   children: any,
   redirectURI: string,
   className?: string,
   onSuccess: (info: ExternalLoginInfo) => void,
   onFailure: (msg: string) => void,
   onClick?: () => void,
   onClosedWithoutAction?: () => void,
};
export default GoogleLogin;