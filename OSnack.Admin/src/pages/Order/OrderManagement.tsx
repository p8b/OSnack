import React from 'react';
import Container from '../../components/Container';
import ViewOrders from '../../components/Order/ViewOrders';


const OrderManagement = (props: IProps) => {
   return (
      <Container className="container-fluid ">
         <ViewOrders />
      </Container>
   );
};

declare type IProps = {

};
export default OrderManagement;
