import React, { useEffect, useRef, useState } from 'react';
import { Communication, Order, OrderStatusType } from 'osnack-frontend-shared/src/_core/apiModels';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import OrderDetails from 'osnack-frontend-shared/src/components/Order/OrderDetails';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import OrderMessageModal from './OrderMessageModal';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';
import { usePutSecretCommunication } from '../../SecretHooks/useCommunicationHook';
import { Access } from '../../_core/appConstant.Variables';

const OrderModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);

   const [openMessageModalType, setOpenMessageModalType] = useState(OrderStatusType.InProgress);
   const [selectedDispute, setSelectedDispute] = useState(new Communication());

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setSelectedOrder(props.order);
   }, [props.order]);

   const getAvailabeType = () => {
      switch (props.order.status) {

         case OrderStatusType.InProgress:
            return [OrderStatusType.Confirmed, OrderStatusType.Canceled];
         case OrderStatusType.Confirmed:
            if (props.order.dispute == undefined)
               return [OrderStatusType.Delivered];
            else
               return [OrderStatusType.Delivered, OrderStatusType.FullyRefunded, OrderStatusType.PartialyRefunded];
         case OrderStatusType.Delivered:
            if (props.order.dispute == undefined)
               return [];
            else
               return [OrderStatusType.FullyRefunded, OrderStatusType.PartialyRefunded];
         case OrderStatusType.FullyRefunded:
         case OrderStatusType.PartialyRefunded:
         case OrderStatusType.Canceled:
            return [];
         default:
            return [];
      }
   };

   const updateMessage = (message: string, refundValue: number) => {
      setIsOpenMessageModal(false);
      switch (openMessageModalType) {
         case OrderStatusType.Canceled:
         case OrderStatusType.PartialyRefunded:
         case OrderStatusType.FullyRefunded:
            selectedOrder.payment.message = message;
            selectedOrder.payment.refundAmount = refundValue;
            setSelectedOrder(selectedOrder);
            break;
         case OrderStatusType.Confirmed:
            setSelectedOrder({ ...selectedOrder, shippingReference: message });
            break;
         default:
      }

   };
   const modalRequireType = [OrderStatusType.Confirmed, OrderStatusType.FullyRefunded, OrderStatusType.PartialyRefunded, OrderStatusType.Canceled];
   const statusChange = (status: OrderStatusType) => {
      if (status == props.order.status) {
         props.onClose();
         return;
      }
      if (modalRequireType.includes(status)) {
         setOpenMessageModalType(status);
         setIsOpenMessageModal(true);
      }
      setSelectedOrder({ ...selectedOrder, status: status });
   };

   const saveChange = (loadingCallBack?: () => void) => {
      if (selectedOrder.status == props.order.status)
         props.onClose();
      else
         usePutOrderStatusOrder!(selectedOrder).then(() => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            props.onSuccess();
            loadingCallBack!();
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
            loadingCallBack!();
         });
   };

   return (
      <Modal className="col-12 col-sm-11 col-lg-9 m-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Order Details" />
         <OrderDetails order={selectedOrder} access={Access}
            availabeType={getAvailabeType()}
            statusChanged={statusChange}
            showDispute={dispute => { setSelectedDispute(dispute); setIsOpenDisputeModal(true); }} />

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <ModalFooter
            updateText="Save"
            cancelText={`${getAvailabeType().length == 0 ? "Close" : "Cancel"}`}
            onUpdate={getAvailabeType().length > 0 ? saveChange : undefined}
            enableLoadingUpdate={isUnmounted}
            onCancel={() => { props.onClose(); setSelectedOrder(props.order); }}
         />

         <OrderMessageModal isOpen={isOpenMessageModal}
            onClose={() => { setIsOpenMessageModal(false); setSelectedOrder(props.order); }}
            onSave={updateMessage}
            totalPrice={selectedOrder.totalPrice}
            type={openMessageModalType}
         />

         <CommunicationModal isOpen={isOpenDisputeModal}
            communication={selectedDispute}
            access={Access}
            onClose={() => { setIsOpenDisputeModal(false); }}
            usePutSecretCommunication={usePutSecretCommunication}
         />
      </Modal >
   );
};

declare type IProps = {
   order: Order;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
   onSuccess: () => void;
   onDispute?: (order: Order) => void;
};
export default OrderModal;
