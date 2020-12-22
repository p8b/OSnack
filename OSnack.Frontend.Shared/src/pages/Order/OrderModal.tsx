import React, { useState } from 'react';
import { Order, OrderStatusType } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import PageHeader from '../../components/Texts/PageHeader';
import { Button } from '../../components/Buttons/Button';
import { ClientAppAccess } from '../../_core/constant.Variables';




const OrderModal = (props: IProps) => {
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const getAvailabeType = () => {
      if (props.access == ClientAppAccess.Official)
         return [];
      switch (props.order.status) {

         case OrderStatusType.InProgress:
            return [OrderStatusType.Confirmed, OrderStatusType.Canceled];
         case OrderStatusType.RefundRequest:
            return [OrderStatusType.RefundRefused, OrderStatusType.FullyRefunded, OrderStatusType.PartialyRefunded];
         case OrderStatusType.Confirmed:
            return [OrderStatusType.Delivered];
         case OrderStatusType.FullyRefunded:
         case OrderStatusType.PartialyRefunded:
         case OrderStatusType.Canceled:
         case OrderStatusType.RefundRefused:
         case OrderStatusType.Delivered:
            return [];
         default:
            return [];
      }
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-8 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Order Details" />
            <div className="row  mt-1">
               <OrderDetails order={props.order} access={props.access}
                  availabeType={getAvailabeType()}
                  statusChanged={(newStatuse) => setSelectedOrder({ ...props.order, status: newStatuse })} />
               {/***** buttons ****/}
               {(props.access == ClientAppAccess.Official || getAvailabeType().length == 0) &&
                  <div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                     <Button children="Cancel"
                        className={`col-12 mt-2 btn-white btn-lg col-sm-6"}`}
                        onClick={() => { props.onClose(); }} />
                  </div>
               }
               {props.access == ClientAppAccess.Secret && getAvailabeType().length > 0 &&
                  < div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                     <Button children="Save"
                        className={`col-12 col-md-6 mt-2 btn-green btn-lg col-sm-6"}`}
                        onClick={() => { props.onSave!(selectedOrder); }} />
                     <Button children="Cancel"
                        className={`col-12 col-md-6 mt-2 btn-white btn-lg col-sm-6"}`}
                        onClick={() => { props.onClose(); }} />
                  </div>
               }
            </div >
         </>
      </Modal >

   );

};

declare type IProps = {
   order: Order;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
   access: ClientAppAccess;
   onSave?: (order: Order) => void;
};
export default OrderModal;
