import React from 'react';
import { uuidv4 } from '../../_core/appFunc';
import { ExternalLoginInfo } from '../../_core/apiModels';
import { RegistrationTypes } from '../../_core/constant.Variables';

const FacebookLogin = (props: IProps) => {
   let callBackWasCalled = false;
   const login = async () => {
      props!.onClick!();
      localStorage.setItem("facebookState", uuidv4());
      const windowPop: Window | null = window.open(`https://www.facebook.com/v7.0/dialog/oauth?client_id=${props.clientId}&redirect_uri=${props.redirectURI}&state=${localStorage.getItem('facebookState')}`,
         "_blank", "width=400,height=500");
      let timer = setInterval(() => {
         if (windowPop!.closed) {
            clearInterval(timer!);
            if (!callBackWasCalled)
               props.onClosedWithoutAction!();
            else
               callBackWasCalled = false;
         }
      }, 1000) as unknown as NodeJS.Timeout;
      windowPop!.opener.callBack = () => {
         callBackWasCalled = true;
         const reply = windowPop!.document.location.search.replace("?code", "")!.replace("&state", "")!.split('=');
         if (reply![2] != null && localStorage.getItem("facebookState") === reply![2]) {
            props.onSuccess(new ExternalLoginInfo(reply![1], reply![2], RegistrationTypes.Facebook));
            localStorage.removeItem("facebookState");
         } else props.onFailure("Facebook Login Failed. Cannot retrieve code!");
      };
   };
   try {
      const reply = document.location.search.replace("?code", "")!.replace("&state", "")!.split('=');
      if (reply![2] != null && localStorage.getItem("facebookState") === reply![2]) {
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
   onSuccess: (info: ExternalLoginInfo) => void;
   onFailure: (msg: string) => void;
   onClick?: () => void,
   onClosedWithoutAction?: () => void,
};
export default FacebookLogin;