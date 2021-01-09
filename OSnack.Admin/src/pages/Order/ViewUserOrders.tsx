import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import ViewOrders from 'osnack-frontend-shared/src/components/Order/ViewOrders';
import { useAllUserOrder, usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';
import { useAddMessageSecretCommunication } from '../../SecretHooks/useCommunicationHook';

const ViewUserOrders = (props: IProps) => {
   return (
      <Container>
         <ViewOrders
            access={Access}
            useAllUserOrderSecret={useAllUserOrder}
            usePutOrderStatusOrder={usePutOrderStatusOrder}
            location={props.location}
            useAddMessageSecretCommunication={useAddMessageSecretCommunication}
         />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
