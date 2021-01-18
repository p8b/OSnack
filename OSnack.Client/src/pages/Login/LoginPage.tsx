import React, { useState } from 'react';
import { Access } from '../../_core/appConstant.Variables';

import Login from 'osnack-frontend-shared/src/components/Login/Login';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { User } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import NewCustomer from './NewCustomerModal';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';

const LoginPage = (props: IProps) => {
   const [newUser, setNewUser] = useState(new User());
   const [isOpenNewCustomer, setIsOpenNewCustomer] = useState(false);
   const externalLoginFailed = (user: User) => {
      setIsOpenNewCustomer(true);
      setNewUser(user);
   };
   return (
      <>
         <PageHeader title="Login" />
         <Container className="mb-5">
            <div className="row justify-content-sm-center pb-3">
               <div className="col-sm-10 col-md-8 col-lg-6 bg-white py-5">
                  <Login externalLoginFailed={externalLoginFailed} fromPath={props.location.state?.fromPath} access={Access} />
                  <Button children="New Customer" className="btn-lg btn-white col-12 my-2"
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
      </>
   );
};

declare type IProps = {
   location: any;
};
export default LoginPage;
