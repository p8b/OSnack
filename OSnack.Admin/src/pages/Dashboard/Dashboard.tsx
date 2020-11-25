import React from 'react';
import Container from '../../components/Container';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
const Dashboard = (props: IProps) => {

   return (
      <Container className="container-fluid  pr-0">
         <PageHeader title="Dashboard" className="line-header-lg" />
      </Container>
   );
};

declare type IProps = {
};
export default Dashboard;

