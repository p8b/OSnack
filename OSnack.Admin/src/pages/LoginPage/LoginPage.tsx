import React from 'react';
import Container from '../../components/Container';
import Login from 'osnack-frontend-shared/src/components/Login/Login';
import { User } from 'osnack-frontend-shared/src/_core/apiModels';
import { Access } from '../../_core/appConstant.Variables';

const LoginPage = (props: IProps) => {
   const externalLoginFailed = (user: User) => {

   };
   return (
      <Container>
         <div className="row justify-content-sm-center">
            <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4 mb-5 mt-1">
               <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} access={Access} />
            </div>
         </div>
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default LoginPage;
