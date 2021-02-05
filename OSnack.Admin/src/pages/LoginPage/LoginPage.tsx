import React, { useContext, useEffect } from 'react';
import Login from 'osnack-frontend-shared/src/components/Login/Login';
import { User } from 'osnack-frontend-shared/src/_core/apiModels';
import { Notification, NotificationContext, NotificationShow } from 'osnack-frontend-shared/src/_core/notificationContext';

const LoginPage = (props: IProps) => {

   const notifCtx = useContext(NotificationContext);
   const externalLoginFailed = (user: User) => {

   };
   useEffect(() => {
      props.mainContainerToggler(false);
      return () => {
         if (window.innerWidth > 768)
            props.mainContainerToggler(true);
      };
   }, []);
   return (
      <div className="row pm-0 justify-content-sm-center">
         <div className="row col-12">
            <div className="m-auto">
               <img id="logo" alt="Logo" className="Logo pm-0" src={`/public/images/logo.png`} onClick={() => { notifCtx.add(new Notification("demo", NotificationShow.always, 4)); }} />
               <p className="text-center">Management</p>
            </div>
         </div>
         <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4  mt-1">
            <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} />
         </div>
      </div>
   );
};

declare type IProps = {
   location: any;
   mainContainerToggler: (isOpen: boolean) => void;
};
export default LoginPage;
