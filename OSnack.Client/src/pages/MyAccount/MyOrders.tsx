
import ViewOrders from 'osnack-frontend-shared/src/components/Order/ViewOrders';
import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';

const MyOrders = (props: IProps) => {

   return (
      <Container className="mt-2 mb-2">
         <ViewOrders access={Access} />
      </Container>
   );
};

declare type IProps = {
};
export default MyOrders;
