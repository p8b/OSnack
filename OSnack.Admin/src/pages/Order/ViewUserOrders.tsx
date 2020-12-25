import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import ViewOrders from 'osnack-frontend-shared/src/pages/Order/ViewOrders';
import { useAllUserOrder, usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';

const ViewUserOrders = (props: IProps) => {
   console.log(props.location.state);
   return (
      <Container>
         <ViewOrders
            access={Access}
            useAllUserOrderSecret={useAllUserOrder}
            usePutOrderStatusOrder={usePutOrderStatusOrder}
            location={props.location}
         />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
