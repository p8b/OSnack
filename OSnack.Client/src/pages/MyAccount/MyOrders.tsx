
import ViewOrders from 'osnack-frontend-shared/src/pages/Order/ViewOrders';
import React from 'react';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
const MyOrders = (props: IProps) => {
   return (
      <Container>
         <ViewOrders access={Access} />
      </Container>
   );
};

declare type IProps = {
};
export default MyOrders;
