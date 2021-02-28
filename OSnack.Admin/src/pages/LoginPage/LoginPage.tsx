import React, { useEffect } from 'react';
import Login from 'osnack-frontend-shared/src/components/Login/Login';

const LoginPage = (props: IProps) => {
   useEffect(() => {
      props.mainContainerToggler(false);
      return () => {
         if (window.innerWidth > 768)
            props.mainContainerToggler(true);
      };
   }, []);
   return (
      <div className="row vh-100 pm-0">
         <div className="row p-0 m-0 col-12 my-auto">
            <img className="col-auto Logo mx-auto" src={`/public/images/logo.png`} alt="OSnack Logo" />
            <p className="col-12 text-center">Management</p>
            <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 py-4 mx-auto">
               <Login fromPath={props.location.state?.fromPath} />
            </div>
         </div>
      </div>
   );
};

declare type IProps = {
   location: any;
   mainContainerToggler: (isOpen: boolean) => void;
};
export default LoginPage;
