import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useState } from 'react';
//import ReactDOM from 'react-dom';
import Container from '../../components/Container';
import { ShopContext } from '../../_core/Contexts/shopContext';
import BasketItem from './BasketItem';
import Checkout from './Checkout';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { useHistory } from 'react-router-dom';

const Basket = (props: IProps) => {
   const basket = useContext(ShopContext);
   const history = useHistory();
   const [refreshBasket, setRefreshBasket] = useState(false);

   return (
      <>
         <PageHeader title="Basket" className="hr-section-sm" />
         <Container className="bg-white">
            <div className="row">
               {basket.list.length <= 0 &&
                  <div className="row col-12 pm-0 justify-content-center pb-4">
                     <div className="col-12 text-center mt-4">You don't have any items in your basket. <br /> Let's do something about it.</div>
                     <Button className="btn btn-green col-auto mt-4" children="Shop now" onClick={() => { history.push("/Shop"); }} />
                  </div>
               }
               {basket.list.length > 0 &&
                  <>
                     {/* Basket info */}
                     < div className="col-12 col-md-7 m-0 pb-5">
                        {basket.list.map(orderItem =>
                           <BasketItem
                              key={orderItem.productId}
                              orderItem={orderItem}
                              onChange={(val) => { setRefreshBasket(true); }}
                           />
                        )}
                     </div>

                     {/* User info */}
                     <Checkout className="col-12 col-md-5 m-0 shadow py-5"
                        refresh={refreshBasket} setRefresh={setRefreshBasket} />
                  </>
               }
            </div>
         </Container>
      </>
   );
};

declare type IProps = {
   location: any;
};
export default Basket;
