
import OrderDetails from 'osnack-frontend-shared/src/components/Order/OrderDetails';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React from 'react';
import { Redirect } from 'react-router';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
const OrderSuccess = (props: IProps) => {
   if (props.location.state.order != null) {
      return (
         <Container className="justify-content-center mb-5 pb-5">
            <div className="col-12 text-center">
               <PageHeader className="h1" title="Thank you for your order." />
            </div>
            <div className="row col-12">
               <OrderDetails order={props.location.state.order} access={Access} disableDispute />
            </div>
         </Container>
      );
   }
   return <Redirect to="/Shop" />;
};

declare type IProps = {
   location: any;
};
export default OrderSuccess;
