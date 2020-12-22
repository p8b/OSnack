import React, { useState } from 'react';
import { Access } from '../../_core/appConstant.Variables';

import Login from 'osnack-frontend-shared/src/components/Login/Login';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { User } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import NewCustomer from './NewCustomerModal';

const LoginPage = (props: IProps) => {
   const [newUser, setNewUser] = useState(new User());
   const [isOpenNewCustomer, setIsOpenNewCustomer] = useState(false);
   console.log(props.location.state?.fromPath);
   const externalLoginFailed = (user: User) => {
      setIsOpenNewCustomer(true);
      setNewUser(user);
   };
   return (
      <Container>
         <div className="row justify-content-sm-center">
            <div className="col-sm-10 col-md-8 col-lg-6 bg-white p-sm-5 pt-4 pb-4">
               <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} access={Access} />
               <Button children="New Customer" className="btn-lg btn-white col-12 mt-2"
                  onClick={() => {
                     setIsOpenNewCustomer((prev) => !prev);
                  }}
               />
            </div>
         </div>
         <NewCustomer isOpen={isOpenNewCustomer}
            onCancel={() => {
               setIsOpenNewCustomer(false);
               setNewUser(new User());
            }}
            newUser={newUser}
         />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default LoginPage;
