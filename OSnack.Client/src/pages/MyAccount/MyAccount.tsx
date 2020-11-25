import React, { useContext } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import UserAccount from 'osnack-frontend-shared/src/components/UserAccount/UserAccount';
import { AuthContext } from 'osnack-frontend-shared/src/_core/authenticationContext';
import Container from '../../components/Container';
const MyAccount = (props: IProps) => {
   const auth = useContext(AuthContext);
   return (
      <>
         <PageHeader title="Account Details" className="line-header-lg" />
         <Container className="bg-white pt-4 pb-5">
            <UserAccount user={auth.state.user} />
         </Container>
      </>
   );
};

declare type IProps = {
};
export default MyAccount;
