import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import ViewOrders from 'osnack-frontend-shared/src/pages/Order/ViewOrders';
import { useAllUserOrder, usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';

const ViewUserOrders = (props: IProps) => {

   return (
      <Container className="container-fluid">
         <ViewOrders backUrl="/Users"
            access={Access} location={props.location}
            useAllUserOrderSecret={useAllUserOrder}
            usePutOrderStatusOrder={usePutOrderStatusOrder}
         />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
