
import OrderDetails from 'osnack-frontend-shared/src/components/OrderDetails/OrderDetails';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router';
import Container from '../../components/Container';
import { Access } from '../../_core/appConstant.Variables';
import { ShopContext } from '../../_core/shopContext';
const OrderSuccess = (props: IProps) => {
   const basket = useContext(ShopContext);
   useEffect(() => {
      basket.clear();
   });
   if (props.location.state.order != null) {
      return (
         <Container className="justify-content-center">
            <div className="col-12 text-center">
               <PageHeader className="h1" title="Thank you for your order." />
            </div>
            <div className="row col-12">
               <OrderDetails order={props.location.state.order} access={Access} />
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
