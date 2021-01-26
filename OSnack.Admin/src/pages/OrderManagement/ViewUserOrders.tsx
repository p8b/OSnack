import React from 'react';
import ViewOrders from './ViewOrders';


const ViewUserOrders = (props: IProps) => {
   return (
      <ViewOrders location={props.location} />
   );
};

declare type IProps = {
   location: any;
};
export default ViewUserOrders;
