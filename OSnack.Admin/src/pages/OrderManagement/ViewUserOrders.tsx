import React from 'react';
import Container from '../../components/Container';
import ViewOrders from './ViewOrders';


const ViewUserOrders = (props: IProps) => {
   return (
      <Container className="container-fluid ">
         <ViewOrders location={props.location} />
      </Container>
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
