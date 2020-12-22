import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import ViewOrders from 'osnack-frontend-shared/src/pages/Order/ViewOrders';
import { useAllUserOrder } from '../../SecretHooks/useOrderHook';

const ViewUserOrders = (props: IProps) => {

   return (
      <Container className="container-fluid">
         <ViewOrders backUrl="/Users" useAllUserOrderSecret={useAllUserOrder} access={Access} location={props.location} />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
