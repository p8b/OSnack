import React, { useEffect, useRef, useState } from 'react';
import { useAllOrder } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useOrderHook';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Order, OrderStatusTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import ButtonCard from 'osnack-frontend-shared/src/components/Buttons/ButtonCard';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import OrderModal from './OrderModal';

const MyOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [orderList, setOrderList] = useState<Order[]>([]);
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);

   useEffect(() => {
      useAllOrder().then(result => {
         if (isUnmounted.current) return;
         console.log(result.data);
         setOrderList(result.data);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   }, []);

   return (
      <Container className="wide-container p-0 m-0">
         <PageHeader title="Order Deatils" className="hr-section-sm" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         {orderList.length > 0 &&
            orderList.map(order => {
               return (
                  <ButtonCard key={order.id} cardClassName="card-lg col-12 row p-0 m-0">
                     <div className="col-12 ">
                        <b className="row text-left  mt-auto m-0 p-0">{OrderStatusTypeList.find(t => t.Value == order.status)?.Name}</b>
                        <div className="row text-left ml-2">Date: <p className="m-0 p-0 ml-1"
                           children={new Date(order.date!).ToShortDate()} /> </div>
                        <div className="row text-left ml-2">Total Price: <p className="m-0 p-0 ml-1"
                           children={`£${order.totalPrice}`} /> </div>
                        <div className="text-left ml-2">Delivery Address:
                           <p className="m-0 p-0 ml-1  line-limit-1" children={order.name} />
                           <p className="m-0 p-0 ml-1 line-limit-2" children={order.firstLine} />
                           <p className="m-0 p-0 ml-1 line-limit-2" children={order.secondLine} />
                           <p className="m-0 p-0 ml-1 line-limit-2" children={order.city} />
                           <p className="m-0 p-0 ml-1 line-limit-2" children={order.postcode} />
                        </div>

                     </div>
                     <div className="row col-12 p-0 m-0  mt-auto">
                        <Button className="btn-sm  col m-0 radius-none"
                           children="Show Detail" onClick={() => {
                              setSelectOrder(order);
                              setIsOpenOrderModal(true);
                           }} />

                     </div>
                  </ButtonCard>
               );
            })
         }
         <OrderModal isOpen={isOpenOrderModal}
            order={selectOrder}
            onClose={() => setIsOpenOrderModal(false)} />
      </Container >
   );
};

declare type IProps = {
};
export default MyOrders;
