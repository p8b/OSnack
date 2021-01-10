import React, { useContext, useEffect, useState } from 'react';
import { Communication, ContactType, Message, Order, OrderStatusType } from '../../_core/apiModels';
import Modal from '../../components/Modals/Modal';
import OrderDetails from '../../components/Order/OrderDetails';
import PageHeader from '../../components/Texts/PageHeader';
import { ClientAppAccess } from '../../_core/constant.Variables';
import OrderMessageModal from './OrderMessageModal';
import { AuthContext } from '../../_core/authenticationContext';
import AddDisputeModal from './AddDisputeModal';
import CommunicationModal from './CommunicationModal';
import { IReturnUsePutOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';
import ModalFooter from './ModalFooter';

const OrderModal = (props: IProps) => {
   const auth = useContext(AuthContext);
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [isOpenAddDisputeModal, setIsOpenAddDisputeModal] = useState(false);

   const [openMessageModalType, setOpenMessageModalType] = useState(OrderStatusType.InProgress);
   const [selectedDispute, setSelectedDispute] = useState(new Communication());

   useEffect(() => {
      setSelectedOrder(props.order);
   }, [props.order]);

   const getAvailabeType = () => {
      if (props.access == ClientAppAccess.Official)
         return [];
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
            if (selectedOrder.dispute == undefined)
               selectedOrder.dispute = {
                  type: ContactType.Dispute,
                  email: auth.state.user.email,
                  status: false, messages: [{ body: message }]
               };
            else
               selectedOrder.dispute.messages?.push({ body: message, isCustomer: false });
            selectedOrder.refundValue = refundValue;
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

   const saveChange = () => {
      if (selectedOrder.status == props.order.status)
         props.onClose();
      else
         props.onSave!(selectedOrder);
   };

   return (
      <Modal className="col-12 col-sm-11 col-lg-9 m-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Order Details" />
         <OrderDetails order={selectedOrder} access={props.access}
            availabeType={getAvailabeType()}
            statusChanged={statusChange} onDispute={() => { setIsOpenAddDisputeModal(true); }}
            showDispute={dispute => { setSelectedDispute(dispute); setIsOpenDisputeModal(true); }} />

         <ModalFooter
            updateConfirmText="Save"
            cancelText={`${(props.access == ClientAppAccess.Official || getAvailabeType().length == 0) ? "Close" : "Cancel"}`}
            onUpdate={(props.access == ClientAppAccess.Secret && getAvailabeType().length > 0) ? saveChange : undefined}
            onCancel={() => { props.onClose(); setSelectedOrder(props.order); }}
         />

         <OrderMessageModal isOpen={isOpenMessageModal}
            onClose={() => { setIsOpenMessageModal(false); setSelectedOrder(props.order); }}
            onSave={updateMessage}
            totalPrice={selectedOrder.totalPrice}
            type={openMessageModalType}
         />
         <AddDisputeModal isOpen={isOpenAddDisputeModal}
            order={selectedOrder}
            onClose={(dispute) => { setIsOpenAddDisputeModal(false); setSelectedOrder({ ...selectedOrder, dispute: dispute }); }}
         />

         <CommunicationModal isOpen={isOpenDisputeModal}
            communication={selectedDispute}
            access={props.access}
            onClose={() => { setIsOpenDisputeModal(false); }}
            usePutSecretCommunication={props.usePutSecretCommunication}
         />
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
   onDispute?: (order: Order) => void;
   usePutSecretCommunication?: (message: Message, communicationId: string | null, status: boolean) => Promise<IReturnUsePutOfficialCommunication>;
};
export default OrderModal;
