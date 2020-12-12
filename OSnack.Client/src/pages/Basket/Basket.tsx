import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useState } from 'react';
//import ReactDOM from 'react-dom';
import Container from '../../components/Container';
import { ShopContext } from '../../_core/shopContext';
import BasketItem from './BasketItem';
import { Redirect } from 'react-router-dom';
import Checkout from './Checkout';


const Basket = (props: IProps) => {
   const basket = useContext(ShopContext);
   const [refreshBasket, setRefreshBasket] = useState(false);
   // // @ts-ignore
   // const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

   if (basket.state.List.length <= 0)
      return <Redirect to="/Shop" />;

   return (
      <Container className="wide-container p-0 m-0">
         <PageHeader title="Basket" className="hr-section-sm" />
         <Container className="bg-white">
            <div className="row">
               {/* Basket info */}
               <div className="col-12 col-md-7 col-lg-6 m-0">
                  {basket.state.List.map(orderItem =>
                     <BasketItem
                        key={orderItem.productId}
                        orderItem={orderItem}
                        onChange={(val) => { setRefreshBasket(true); }}
                     />
                  )}
               </div>

               {/* User info */}
               <Checkout refresh={refreshBasket} setRefresh={setRefreshBasket} />
            </div>
         </Container>
      </Container >
   );
};

declare type IProps = {
   location: any;
};
export default Basket;
