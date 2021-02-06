import React, { useEffect, useRef, useState } from 'react';
import { Communication, Order } from 'osnack-frontend-shared/src/_core/apiModels';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import OrderDetails from 'osnack-frontend-shared/src/components/Order/OrderDetails';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import AddDisputeModal from './AddDisputeModal';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import ModalFooter from 'osnack-frontend-shared/src/components/Modals/ModalFooter';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { AppAccess } from 'osnack-frontend-shared/src/_core/appConst';

const OrderModal = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [selectedOrder, setSelectedOrder] = useState(new Order());
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [isOpenAddDisputeModal, setIsOpenAddDisputeModal] = useState(false);

   const [selectedDispute, setSelectedDispute] = useState(new Communication());

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      setSelectedOrder(props.order);
   }, [props.order]);


   return (
      <Modal className="col-12 col-sm-11 col-lg-9 m-0"
         bodyRef={props.modalRef}
         isOpen={props.isOpen}>
         <PageHeader title="Order Details" />
         <OrderDetails order={selectedOrder} access={AppAccess.Client}
            availabeType={[]}
            onDispute={() => { setIsOpenAddDisputeModal(true); }}
            showDispute={dispute => { setSelectedDispute(dispute); setIsOpenDisputeModal(true); }} />

         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <ModalFooter
            cancelText="Close"
            onCancel={() => { props.onClose(); setSelectedOrder(props.order); }}
         />
         <AddDisputeModal isOpen={isOpenAddDisputeModal}
            order={selectedOrder}
            onClose={(dispute) => { setIsOpenAddDisputeModal(false); setSelectedOrder({ ...selectedOrder, dispute: dispute }); }}
         />
         <CommunicationModal isOpen={isOpenDisputeModal}
            communication={selectedDispute}
            access={AppAccess.Client}
            onClose={() => { setIsOpenDisputeModal(false); }}
         />
      </Modal >
   );
};

declare type IProps = {
   order: Order;
   isOpen: boolean;
   onClose: () => void;
   modalRef?: any;
};
export default OrderModal;
