import React, { useEffect } from 'react';
import Container from '../../components/Container';
import Login from 'osnack-frontend-shared/src/components/Login/Login';
import { User } from 'osnack-frontend-shared/src/_core/apiModels';
import { Access } from '../../_core/appConstant.Variables';

const LoginPage = (props: IProps) => {
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
      <Container>
         <div className="row justify-content-sm-center">
            <div className="row col-12 pm-0 ">
               <div className="m-auto">
                  <img id="logo" alt="Logo" className="Logo pm-0" src={`/public/images/logo.png`} />
                  <p className="text-center">Management</p>
               </div>
            </div>
            <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4 mb-5 mt-1">
               <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} access={Access} />
            </div>
         </div>
      </Container>
   );
};

declare type IProps = {
   location: any;
   mainContainerToggler: (isOpen: boolean) => void;
};
export default LoginPage;
