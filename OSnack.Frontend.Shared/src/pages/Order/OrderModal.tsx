import React, { useEffect, useState } from 'react';
import { Order, OrderStatusType } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import OrderDetails from '../../components/OrderDetails/OrderDetails';
import PageHeader from '../../components/Texts/PageHeader';
import { Button } from '../../components/Buttons/Button';
import { ClientAppAccess } from '../../_core/constant.Variables';
import OrderMessageModal, { OrderMessageType } from './OrderMessageModal';




const OrderModal = (props: IProps) => {
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);
   const [openMessageModalType, setOpenMessageModalType] = useState(OrderMessageType.RefundMessage);

   useEffect(() => {
      setSelectedOrder(props.order);
   }, [props.order]);

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

   const updateOrder = (message: string) => {
      setIsOpenMessageModal(false);
      switch (openMessageModalType) {
         case OrderMessageType.RefundMessage:
            setSelectedOrder({ ...selectedOrder, message: message });
            break;
         case OrderMessageType.ShippingReference:
            setSelectedOrder({ ...selectedOrder, shippingReference: message });
            break;
         default:
      }

   };

   const statusChange = (status: OrderStatusType) => {
      if (status == props.order.status) {
         props.onClose();
         return;
      }
      if (status == OrderStatusType.Canceled) {
         setOpenMessageModalType(OrderMessageType.RefundMessage);
         setIsOpenMessageModal(true);
      } else
         if (status == OrderStatusType.Confirmed) {
            setOpenMessageModalType(OrderMessageType.ShippingReference);
            setIsOpenMessageModal(true);
         }
      setSelectedOrder({ ...selectedOrder, status: status });
   };

   return (
      <Modal className="col-11 col-sm-10 col-lg-8 pm-0 pl-4 pr-4 pb-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <>
            <PageHeader title="Order Details" />
            <div className="row  mt-1">
               <OrderDetails order={selectedOrder} access={props.access}
                  availabeType={getAvailabeType()}
                  statusChanged={statusChange} />
               {/***** buttons ****/}
               <div className="row col-12 pm-0 pos-b-sticky bg-white pb-3">
                  {props.access == ClientAppAccess.Secret && getAvailabeType().length > 0 &&
                     <Button children="Save"
                        className={`col-12 col-md-6 mt-2 btn-green btn-lg col-sm-6"}`}
                        onClick={() => { props.onSave!(selectedOrder); }} />
                  }
                  <Button children={`${(props.access == ClientAppAccess.Official || getAvailabeType().length == 0) ? "Close" : "Cancel"}`}
                     className={`col-12 ${props.access == ClientAppAccess.Secret && getAvailabeType().length > 0 ? "col-md-6" : ""} mt-2 btn-white btn-lg col-sm-6"}`}
                     onClick={() => { props.onClose(); }} />
               </div>
            </div >

            <OrderMessageModal isOpen={isOpenMessageModal}
               onClose={() => { setIsOpenMessageModal(false); console.log(props.order); setSelectedOrder(props.order); }}
               onSave={updateOrder}
               type={openMessageModalType} />
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
