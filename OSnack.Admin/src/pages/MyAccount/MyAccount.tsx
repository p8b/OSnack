
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import UserAccount from 'osnack-frontend-shared/src/components/UserAccount/UserAccount';
import { AuthenticationContext } from 'osnack-frontend-shared/src/_core/Contexts/authenticationContext';
import React, { useContext } from 'react';
import Container from '../../components/Container';
const MyAccount = (props: IProps) => {
   const auth = useContext(AuthenticationContext);
   return (
      <>
         <PageHeader title="Account Details" className="line-header-lg" />
         <Container className="bg-white pt-4 pb-5">
            <UserAccount user={auth.user} />
         </Container>
      </>
   );
};

declare type IProps = {
};
export default MyAccount;
